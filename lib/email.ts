import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 465),
  secure: (process.env.SMTP_SECURE || 'true') === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function layout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#F4F3FB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F3FB;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border:1px solid #E4E2F2;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#241C4F;padding:28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display:inline-block;width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#4F46E5,#8B5CF6);vertical-align:middle;"></span>
                    <span style="display:inline-block;vertical-align:middle;margin-left:10px;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Deal<span style="color:#A78BFA;">Link</span></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color:#F4F3FB;padding:20px 32px;border-top:1px solid #E4E2F2;">
              <p style="margin:0;font-size:12px;color:#8C8CA3;line-height:1.6;">
                You received this email because of your DealLink account.<br />
                © ${new Date().getFullYear()} DealLink Inc. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

const button = (href: string, label: string) => `
<a href="${href}" style="display:inline-block;background-color:#4F46E5;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:13px 28px;border-radius:10px;margin:8px 0;">${label}</a>
`;

export async function sendVerificationEmail(to: string, name: string, token: string) {
  if (!isEmailConfigured()) {
    console.warn('[email] SMTP not configured — verification email skipped for', to);
    return;
  }
  const link = `${process.env.APP_URL}/verify-email?token=${token}`;
  const content = `
    <h1 style="margin:0 0 12px;font-size:22px;color:#151231;">Verify your email address</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#5B5B72;line-height:1.7;">
      Hi ${name}, welcome to DealLink! Please confirm your email address to activate your creator profile.
    </p>
    ${button(link, 'Verify my email')}
    <p style="margin:20px 0 0;font-size:13px;color:#8C8CA3;line-height:1.7;">
      Or paste this link into your browser:<br />
      <a href="${link}" style="color:#4F46E5;word-break:break-all;">${link}</a>
    </p>
    <p style="margin:16px 0 0;font-size:12px;color:#8C8CA3;">This link expires in 24 hours.</p>
  `;
  await transport.sendMail({
    from: process.env.EMAIL_FROM || 'DealLink <no-reply@deallink.co>',
    to,
    subject: 'Verify your DealLink email',
    html: layout(content),
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  if (!isEmailConfigured()) {
    console.warn('[email] SMTP not configured — reset email skipped for', to);
    return;
  }
  const link = `${process.env.APP_URL}/reset-password?token=${token}`;
  const content = `
    <h1 style="margin:0 0 12px;font-size:22px;color:#151231;">Reset your password</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#5B5B72;line-height:1.7;">
      Hi ${name}, we received a request to reset your DealLink password. Click the button below to choose a new one.
    </p>
    ${button(link, 'Reset my password')}
    <p style="margin:20px 0 0;font-size:13px;color:#8C8CA3;line-height:1.7;">
      Or paste this link into your browser:<br />
      <a href="${link}" style="color:#4F46E5;word-break:break-all;">${link}</a>
    </p>
    <p style="margin:16px 0 0;font-size:12px;color:#8C8CA3;">
      This link expires in 1 hour. If you didn&apos;t request this, you can safely ignore this email.
    </p>
  `;
  await transport.sendMail({
    from: process.env.EMAIL_FROM || 'DealLink <no-reply@deallink.co>',
    to,
    subject: 'Reset your DealLink password',
    html: layout(content),
  });
}
