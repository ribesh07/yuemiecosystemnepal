import { NextResponse } from 'next/server';

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import pem from 'pem';

import { objectToKeyValueString } from '@/utils/payments/objectToKeyValueString';

const PASS = process.env.CONNECTIPS_CREDITOR_PASSWORD;
const AUTH_PASS = process.env.CONNECTIPS_AUTH_PASSWORD;

const filePath = path.join(process.cwd(), 'signatures', 'CREDITOR.pfx');
const pfx = fs.readFileSync(filePath);
const SIGNING_KEYS = [
  "MERCHANTID",
  "APPID",
  "APPNAME",
  "TXNID",
  "TXNDATE",
  "TXNCRNCY",
  "TXNAMT",
  "REFERENCEID",
  "REMARKS",
  "PARTICULARS",
  "TOKEN",
] as const;

const readPkcs12WithPass = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    pem.readPkcs12(pfx, { p12Password: password }, (err, cert: any) => {
      if (err || !cert) {
        reject(err || new Error("Failed to read PKCS12 certificate"));
        return;
      }
      const key = cert.key || cert.privateKey || cert.clientKey || cert.serviceKey;
      if (!key) {
        reject(new Error("Private key not found in PKCS12 certificate"));
        return;
      }
      resolve(String(key));
    });
  });
};

const getPrivateKey = async (): Promise<string> => {
  const candidates = [
    PASS,
    AUTH_PASS,
    process.env.CONNECTIPS_PFX_PASSWORD,
  ].filter((v): v is string => Boolean(v && String(v).trim()));

  let lastError: unknown;
  for (const candidate of candidates) {
    try {
      return await readPkcs12WithPass(String(candidate).trim());
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Unable to read PKCS12 private key");
};

export async function POST(request: Request) {
  try {
    if (!PASS && !AUTH_PASS && !process.env.CONNECTIPS_PFX_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Missing PKCS12 password env var" },
        { status: 500 }
      );
    }

    const body = await request.json();

    // ConnectIPS token signature should include only known gateway fields in fixed order.
    const sanitized = SIGNING_KEYS.reduce<Record<string, unknown>>((acc, key) => {
      if (body?.[key] !== undefined && body?.[key] !== null) {
        acc[key] = body[key];
      }
      return acc;
    }, {});
    const message = objectToKeyValueString(sanitized);
    const privateKey = await getPrivateKey();

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(message, 'utf8');
    sign.end();
    const signature = sign.sign(privateKey, 'base64');

    return NextResponse.json({ TOKEN: signature });
  } catch (error) {
    console.error('CONNECTIPS_GET_TOKEN_ERROR', error);
    const msg = error instanceof Error ? error.message : "Unknown token error";
    const isPasswordError =
      /invalid password|mac verify error|pkcs12/i.test(msg);
    return NextResponse.json(
      {
        success: false,
        message: isPasswordError
          ? "PKCS12 certificate password is invalid (CREDITOR.pfx)"
          : "Unable to generate ConnectIPS token",
      },
      { status: 500 }
    );
  }
}
