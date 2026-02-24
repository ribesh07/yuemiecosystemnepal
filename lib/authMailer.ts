type AuthMailInput = {
  to: string;
  subject: string;
  text: string;
  code: string;
};

export async function sendAuthCodeMail(input: AuthMailInput) {
  const webhookUrl = process.env.AUTH_EMAIL_WEBHOOK_URL;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.AUTH_FROM_EMAIL;
  const fromName = process.env.AUTH_FROM_NAME || "Yuemi";

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: input.to,
        subject: input.subject,
        text: input.text,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to deliver mail via AUTH_EMAIL_WEBHOOK_URL");
    }

    return;
  }

  if (resendApiKey && fromEmail) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [input.to],
        subject: input.subject,
        text: input.text,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Resend mail send failed: ${errText}`);
    }

    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Auth email provider not configured. Set AUTH_EMAIL_WEBHOOK_URL or RESEND_API_KEY + AUTH_FROM_EMAIL in production."
    );
  }

  console.log(`[AUTH OTP] ${input.to}: ${input.code}`);
}
