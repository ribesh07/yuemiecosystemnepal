import { NextResponse } from 'next/server';
import { generateConnectIPSToken } from "@/lib/connectipsToken";
import { logConnectIPSDebug } from "@/lib/connectipsDebug";

const PASSWORD = process.env.CONNECTIPS_AUTH_PASSWORD;
const VALADIATION_URL = process.env.CONNECTIPS_VALIDATION_API_URL;
const MERCHANTID =
  process.env.CONNECTIPS_MERCHANTID || process.env.NEXT_PUBLIC_CONNECTIPS_MERCHANTID;
const APPID =
  process.env.CONNECTIPS_APPID || process.env.NEXT_PUBLIC_CONNECTIPS_APPID;

const normalizeEnvValue = (value?: string | null): string => {
  const raw = String(value || "").trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1).trim();
  }
  return raw;
};

export async function POST(request: Request) {
  try {
    const merchantId = normalizeEnvValue(MERCHANTID);
    const appId = normalizeEnvValue(APPID);
    const authPass = normalizeEnvValue(PASSWORD);
    const validationUrl = normalizeEnvValue(VALADIATION_URL);

    if (!merchantId || !appId || !authPass || !validationUrl) {
      return NextResponse.json(
        { status: "ERROR", statusDesc: "ConnectIPS env is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const referenceId = String(body.REFERENCEID || "").trim();
    const txnAmt = Number(body.TXNAMT || 0);
    if (!referenceId || !Number.isFinite(txnAmt) || txnAmt <= 0) {
      return NextResponse.json(
        { status: "ERROR", statusDesc: "Invalid REFERENCEID or TXNAMT" },
        { status: 400 }
      );
    }

    const signaturePayload = {
      MERCHANTID: Number(merchantId),
      APPID: appId,
      REFERENCEID: referenceId,
      TXNAMT: txnAmt,
    };

    const TOKEN = await generateConnectIPSToken(signaturePayload, [
      "MERCHANTID",
      "APPID",
      "REFERENCEID",
      "TXNAMT",
    ]);

    const payload = {
      merchantId: Number(merchantId),
      appId: appId,
      referenceId: referenceId,
      txnAmt: txnAmt,
      token: TOKEN,
    };
    const authUser = appId;
    await logConnectIPSDebug({
      step: "validate:request",
      referenceId,
      data: {
        validationUrl,
        authUser,
        authPassLength: authPass.length,
        payload,
      },
    });

    const credentials = Buffer.from(`${authUser}:${authPass}`).toString("base64");
    const response = await fetch(validationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(payload),
      cache: "no-cache",
    });
    const data: any = await response.json().catch(() => ({}));

    await logConnectIPSDebug({
      step: "validate:response",
      referenceId,
      data: {
        authUser,
        statusCode: response.status,
        ok: response.ok,
        body: data,
      },
    });
    if (!response.ok) {
      return NextResponse.json(
        {
          status: "ERROR",
          statusDesc: data?.statusDesc || "Validate request failed",
          response: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data || {});
  } catch (err) {
    console.error("CONNECTIPS_VALIDATE_ERROR", err);
    await logConnectIPSDebug({
      step: "validate:error",
      data: { message: err instanceof Error ? err.message : String(err) },
    });
    return NextResponse.json({
      status: 'ERROR',
      statusDesc: 'Internal Error',
    }, { status: 500 });
  }
}
