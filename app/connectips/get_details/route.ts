// import { NextResponse } from 'next/server';

// // import { hostname } from '#/utils/constants';
// //Unauthorized Error need to fix

// const hostnameEnv = process.env.NEXT_PUBLIC_HOSTNAME;
// const hostname = hostnameEnv ? hostnameEnv : 'http://localhost:3000';
// const USERID = process.env.CONNECTIPS_MERCHAND_USER_ID;
// const PASSWORD = process.env.CONNECTIPS_AUTH_PASSWORD;
// const VALADIATION_URL = process.env.CONNECTIPS_VALIDATION_API_URL;
// const MERCHANTID = process.env.NEXT_PUBLIC_CONNECTIPS_MERCHANTID;
// const APPID = process.env.NEXT_PUBLIC_CONNECTIPS_APPID;
// const DETAILS_URL = process.env.NEXT_PUBLIC_CONNECTIPS_GETDETAILS_URL;


// // const credentials = Buffer.from(`User Id: ${Mer} Password: ${pass}`).toString("base64");
// const credentials = Buffer.from(`${APPID}:${PASSWORD}`).toString("base64");


// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     body.REFERENCEID = String(body.REFERENCEID);
//     body.APPID = APPID;
//     body.TXNAMT = Number(body.TXNAMT);
//     body.MERCHANTID = Number(MERCHANTID);

//     console.log('Request Body:', body);
//      const signaturePayload = {
//       MERCHANTID: body.MERCHANTID,
//       APPID: body.APPID,
//       REFERENCEID: body.REFERENCEID,
//       TXNAMT: body.TXNAMT,
//     };

//     const tokenResponse = await fetch(`${hostname}/connectips/get_token`, {
//       method: 'POST',
//       body: JSON.stringify(signaturePayload),
//       cache: 'no-cache',
//     });
    

//     if (!tokenResponse.ok) {
//       throw new Error('Token Error');
//     }

//     const { TOKEN } = await tokenResponse.json();

//     const payload = {
//         merchantId: Number(MERCHANTID),          
//         appId: APPID,                           
//         referenceId: String(body.REFERENCEID),   
//         txnAmt: Number(body.TXNAMT),            
//         token: TOKEN
//       };

//     console.log('Payload:', payload);
//     console.log('Validation URL:', VALADIATION_URL);

//     console.log('Credentials :', credentials);

//     const responseDetails = await fetch(DETAILS_URL as string, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Basic ${credentials}`,
//       },
//       body: JSON.stringify(payload),
//       cache: 'no-cache',
//     });

//     console.log('Response Details Status:', responseDetails);


//     if (!responseDetails.ok) {
//       throw new Error('Validate Error');
//     }
//     const data = await responseDetails.json();
//     console.log('Details Response:', data);

//     return NextResponse.json(data);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({
//       status: 'ERROR',
//       statusDesc: 'Internal Error',
//     });
//   }
// }


import { NextResponse } from 'next/server';
import { generateConnectIPSToken } from "@/lib/connectipsToken";
import { logConnectIPSDebug } from "@/lib/connectipsDebug";

// import { hostname } from '#/utils/constants';

const PASSWORD = process.env.CONNECTIPS_AUTH_PASSWORD;
const AUTH_USER_ID = process.env.CONNECTIPS_MERCHAND_USER_ID;
const MERCHANTID = process.env.NEXT_PUBLIC_CONNECTIPS_MERCHANTID;
const APPID = process.env.NEXT_PUBLIC_CONNECTIPS_APPID;
const DETAILS_URL = process.env.NEXT_PUBLIC_CONNECTIPS_GETDETAILS_URL;


export async function POST(request: Request) {
  try {
    if (!MERCHANTID || !APPID || !PASSWORD || !DETAILS_URL) {
      return NextResponse.json(
        { status: "ERROR", statusDesc: "ConnectIPS env is not configured", response: {} },
        { status: 500 }
      );
    }

    const body = await request.json();
    const referenceId = String(body.REFERENCEID || "").trim();
    const txnAmt = Number(body.TXNAMT || 0);
    if (!referenceId || !Number.isFinite(txnAmt) || txnAmt <= 0) {
      return NextResponse.json(
        { status: "ERROR", statusDesc: "Invalid REFERENCEID or TXNAMT", response: {} },
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
      step: "get_details:request",
      referenceId,
      data: {
        detailsUrl: DETAILS_URL,
        authUsers,
        payload,
      },
    });

// console.log('Payload:', payload);
// console.log('Details URL:', DETAILS_URL);
    let response: Response | null = null;
    let data: any = {};
    for (const authUser of authUsers) {
      triedUsers.push(authUser);
      const credentials = Buffer.from(`${authUser}:${authPass}`).toString("base64");
      response = await fetch(DETAILS_URL as string, {
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
        { status: "ERROR", statusDesc: "Get details request failed", response: {} },
        { status: 500 }
      );
    }
    await logConnectIPSDebug({
      step: "get_details:response",
      referenceId,
      data: {
        triedUsers,
        statusCode: response.status,
        ok: response.ok,
        body: data,
      },
    });
    if (!response.ok) {
      return NextResponse.json({
        status: 'ERROR',
        statusDesc: data?.statusDesc || 'RESPONSE Error',
        response: data || {}
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("CONNECTIPS_GET_DETAILS_ERROR", err);
    await logConnectIPSDebug({
      step: "get_details:error",
      data: { message: err instanceof Error ? err.message : String(err) },
    });
    return NextResponse.json({
      status: 'ERROR',
      statusDesc: 'Internal Error',
    }, { status: 500 });
  }
}
