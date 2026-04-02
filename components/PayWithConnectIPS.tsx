'use client';

import Image from 'next/image';

import { getDate } from '@/utils/payments/getDate';

const MERCHANTID = process.env.NEXT_PUBLIC_CONNECTIPS_MERCHANTID as string;
const APPID = process.env.NEXT_PUBLIC_CONNECTIPS_APPID as string;
const APPNAME = process.env.NEXT_PUBLIC_CONNECTIPS_APPNAME as string;
const CONNECTIPS_API_URL = process.env.NEXT_PUBLIC_CONNECTIPS_API_URL as string;

type PayWithConnectIPSProps = {
  amount: number;
  remarks: string;
  particulars: string;
  disabled?: boolean;
  onBeforeSubmit?: (details: {
    referenceId: string;
    txnId: string;
    amount: number;
  }) => void;
  onError?: (message: string) => void;
};

type TransactionDetails = {
  MERCHANTID: string;
  APPID: string;
  APPNAME: string;
  TXNID: string;
  TXNDATE: string;
  TXNCRNCY: 'NPR';
  TXNAMT: string;
  REFERENCEID: string;
  REMARKS: string;
  PARTICULARS: string;
};

type Payload = TransactionDetails & { TOKEN: string };

const initiatePayment = async (
  transactionDetails: TransactionDetails,
  onError?: (message: string) => void
) => {
  try {
    // ConnectIPS expects TOKEN placeholder to be part of the signed payload.
    const tokenPayload = { ...transactionDetails, TOKEN: "TOKEN" };
    const tokenResponse = await fetch('/connectips/get_token', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tokenPayload),
    });

    const tokenData = await tokenResponse.json().catch(() => ({}));
    if (!tokenResponse.ok) {
      throw new Error(tokenData?.message || 'Failed to get payment token');
    }

    const { TOKEN } = tokenData;
    if (!TOKEN) {
      throw new Error("Token not returned from ConnectIPS signer");
    }

    const payload: Payload = { ...transactionDetails, TOKEN };

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = CONNECTIPS_API_URL;

    Object.entries(payload).forEach(([key, value]) => {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = value;
      form.appendChild(hiddenField);
    });

    document.body.appendChild(form);
    form.submit();
  } catch (error) {
    if (onError) {
      onError(
        error instanceof Error
          ? error.message
          : "Failed to start ConnectIPS payment. Please try again."
      );
    }
  }
};

const PayWithConnectIPS = ({
  amount, // in paisa
  remarks,
  particulars,
  disabled = false,
  onBeforeSubmit,
  onError,
}: PayWithConnectIPSProps) => {
  const makeTxnId = () => {
    const timePart = Date.now().toString().slice(-10);
    const randPart = Math.floor(10 + Math.random() * 90).toString();
    return `TXN${timePart}${randPart}`; // 15 chars
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className='flex items-center gap-4 px-6 py-3 border border-gray-300 rounded-md hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed'
      onClick={() => {
        const txnId = makeTxnId();
        // Per ConnectIPS docs, referenceId should be the TXNID passed in gateway request.
        const referenceId = txnId;
        const transactionDetails: TransactionDetails = {
          MERCHANTID,
          APPID,
          APPNAME,
          TXNID: txnId,
          TXNDATE: getDate(),
          TXNCRNCY: "NPR",
          TXNAMT: String(amount),
          REFERENCEID: referenceId,
          REMARKS: remarks,
          PARTICULARS: particulars,
        };

        if (onBeforeSubmit) {
          onBeforeSubmit({ referenceId, txnId, amount });
        }

        initiatePayment(transactionDetails, onError);
      }}
    >
      Pay with
      <Image
        src='/connectIPS.png'
        alt='Pay with ConnectIPS'
        width={90}
        height={90}
      />
    </button>
  );
};

export default PayWithConnectIPS;
