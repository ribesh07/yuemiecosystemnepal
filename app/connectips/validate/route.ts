import { NextResponse } from 'next/server';
import { generateConnectIPSToken } from "@/lib/connectipsToken";
import { logConnectIPSDebug } from "@/lib/connectipsDebug";

const PASSWORD = process.env.CONNECTIPS_AUTH_PASSWORD;
const VALADIATION_URL = process.env.CONNECTIPS_VALIDATION_API_URL;
const MERCHANTID = process.env.NEXT_PUBLIC_CONNECTIPS_MERCHANTID;
const APPID = process.env.NEXT_PUBLIC_CONNECTIPS_APPID;
const credentials = Buffer.from(`${APPID}:${PASSWORD}`).toString("base64");


export async function POST(request: Request) {
  try {
    if (!MERCHANTID || !APPID || !PASSWORD || !VALADIATION_URL) {
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
      MERCHANTID: Number(MERCHANTID),
      APPID: APPID,
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
      merchantId: Number(MERCHANTID),
      appId: APPID,
      referenceId: referenceId,
      txnAmt: txnAmt,
      token: TOKEN,
    };
    await logConnectIPSDebug({
      step: "validate:request",
      referenceId,
      data: {
        validationUrl: VALADIATION_URL,
        payload,
      },
    });


    const response = await fetch(VALADIATION_URL as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-cache',
    });

    const data = await response.json().catch(() => ({}));
    await logConnectIPSDebug({
      step: "validate:response",
      referenceId,
      data: {
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
