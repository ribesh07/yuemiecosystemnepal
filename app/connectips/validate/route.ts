import { NextResponse } from 'next/server';
import { generateConnectIPSToken } from "@/lib/connectipsToken";
import { logConnectIPSDebug } from "@/lib/connectipsDebug";

const PASSWORD = process.env.CONNECTIPS_AUTH_PASSWORD;
const AUTH_USER_ID = process.env.CONNECTIPS_MERCHAND_USER_ID;
const VALADIATION_URL = process.env.CONNECTIPS_VALIDATION_API_URL;
const MERCHANTID =
  process.env.CONNECTIPS_MERCHANTID || process.env.NEXT_PUBLIC_CONNECTIPS_MERCHANTID;
const APPID =
  process.env.CONNECTIPS_APPID || process.env.NEXT_PUBLIC_CONNECTIPS_APPID;


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
    const authPass = String(PASSWORD || "").trim();
    const authUsers = Array.from(
      new Set(
        [String(AUTH_USER_ID || "").trim(), String(APPID || "").trim()].filter(Boolean)
      )
    );
    const triedUsers: string[] = [];
    await logConnectIPSDebug({
      step: "validate:request",
      referenceId,
      data: {
        validationUrl: VALADIATION_URL,
        authUsers,
        payload,
      },
    });

    let response: Response | null = null;
    let data: any = {};
    for (const authUser of authUsers) {
      triedUsers.push(authUser);
      const credentials = Buffer.from(`${authUser}:${authPass}`).toString("base64");
      response = await fetch(VALADIATION_URL as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify(payload),
        cache: "no-cache",
      });
      data = await response.json().catch(() => ({}));
      if (response.ok || response.status !== 401) {
        break;
      }
    }
    if (!response) {
      return NextResponse.json(
        { status: "ERROR", statusDesc: "Validate request failed" },
        { status: 500 }
      );
    }
    await logConnectIPSDebug({
      step: "validate:response",
      referenceId,
      data: {
        triedUsers,
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
