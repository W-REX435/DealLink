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
<body style="margin:0;padding:0;background-color:#EFF4FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EFF4FC;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border:1px solid #DCE5F3;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#0F2A52;padding:28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display:inline-block;width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#2563EB,#22D3EE);vertical-align:middle;"></span>
                    <span style="display:inline-block;vertical-align:middle;margin-left:10px;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Deal<span style="color:#67E8F9;">Link</span></span>
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
            <td style="background-color:#EFF4FC;padding:20px 32px;border-top:1px solid #DCE5F3;">
              <p style="margin:0;font-size:12px;color:#8B98AC;line-height:1.6;">
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
<a href="${href}" style="display:inline-block;background-color:#2563EB;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:13px 28px;border-radius:10px;margin:8px 0;">${label}</a>
`;

export async function sendVerificationEmail(to: string, name: string, token: string) {
  if (!isEmailConfigured()) {
    console.warn('[email] SMTP not configured — verification email skipped for', to);
    return;
  }
  const link = `${process.env.APP_URL}/verify-email?token=${token}`;
  const content = `
    <h1 style="margin:0 0 12px;font-size:22px;color:#0F1B33;">Verify your email address</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#54637D;line-height:1.7;">
      Hi ${name}, welcome to DealLink! Please confirm your email address to activate your creator profile.
    </p>
    ${button(link, 'Verify my email')}
    <p style="margin:20px 0 0;font-size:13px;color:#8B98AC;line-height:1.7;">
      Or paste this link into your browser:<br />
      <a href="${link}" style="color:#2563EB;word-break:break-all;">${link}</a>
    </p>
    <p style="margin:16px 0 0;font-size:12px;color:#8B98AC;">This link expires in 24 hours.</p>
  `;
  await transport.sendMail({
    from: process.env.EMAIL_FROM || 'DealLink <no-reply@deallink.co>',
    to,
    subject: 'Verify your DealLink email',
    html: layout(content),
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {  if (!isEmailConfigured()) {
    console.warn('[email] SMTP not configured — reset email skipped for', to);
    return;
  }
  const link = `${process.env.APP_URL}/reset-password?token=${token}`;
  const content = `
    <h1 style="margin:0 0 12px;font-size:22px;color:#0F1B33;">Reset your password</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#54637D;line-height:1.7;">
      Hi ${name}, we received a request to reset your DealLink password. Click the button below to choose a new one.
    </p>
    ${button(link, 'Reset my password')}
    <p style="margin:20px 0 0;font-size:13px;color:#8B98AC;line-height:1.7;">
      Or paste this link into your browser:<br />
      <a href="${link}" style="color:#2563EB;word-break:break-all;">${link}</a>
    </p>
    <p style="margin:16px 0 0;font-size:12px;color:#8B98AC;">
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

export async function sendBusinessInviteEmail(
  to: string,
  contactName: string,
  company: string,
  token: string
) {
  if (!isEmailConfigured()) {
    console.warn('[email] SMTP not configured — business invite email skipped for', to);
    return;
  }
  const link = `${process.env.APP_URL}/business/set-password?token=${token}`;
  const content = `
    <h1 style="margin:0 0 12px;font-size:22px;color:#0F1B33;">You&apos;re approved, ${contactName}!</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#54637D;line-height:1.7;">
      Great news — <strong>${company}</strong> has been approved to join the DealLink
      creator marketplace. Set a password to activate your business account and start
      browsing vetted creators.
    </p>
    ${button(link, 'Set my password')}
    <p style="margin:20px 0 0;font-size:13px;color:#8B98AC;line-height:1.7;">
      Or paste this link into your browser:<br />
      <a href="${link}" style="color:#2563EB;word-break:break-all;">${link}</a>
    </p>
    <p style="margin:16px 0 0;font-size:12px;color:#8B98AC;">This invite expires in 7 days.</p>
  `;
  await transport.sendMail({
    from: process.env.EMAIL_FROM || 'DealLink <no-reply@deallink.co>',
    to,
    subject: `${company} is approved — activate your DealLink account`,
    html: layout(content),
  });
}

export async function sendBusinessRejectedEmail(
  to: string,
  contactName: string,
  company: string
) {
  if (!isEmailConfigured()) {
    console.warn('[email] SMTP not configured — rejection email skipped for', to);
    return;
  }
  const content = `
    <h1 style="margin:0 0 12px;font-size:22px;color:#0F1B33;">Thanks for applying, ${contactName}</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#54637D;line-height:1.7;">
      We reviewed <strong>${company}</strong>&apos;s application and we&apos;re not able to
      approve it at this time. If your product or campaign changes, feel free to apply
      again in the future.
    </p>
    <p style="margin:16px 0 0;font-size:12px;color:#8B98AC;">— The DealLink team</p>
  `;
  await transport.sendMail({
    from: process.env.EMAIL_FROM || 'DealLink <no-reply@deallink.co>',
    to,
    subject: `Update on your DealLink application (${company})`,
    html: layout(content),
  });
}

export async function sendOfferAcceptedEmail(
  to: string,
  opts: { businessName: string; product: string; creatorName: string }
) {
  if (!isEmailConfigured()) return;
  const content = `
    <h1 style="margin:0 0 12px;font-size:22px;color:#0F1B33;">A creator accepted your brief!</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#54637D;line-height:1.7;">
      Good news — <strong>${opts.creatorName}</strong> accepted your brief for
      <strong>${opts.product}</strong>. Head to your dashboard to kick off the deal.
    </p>
    ${button(`${process.env.APP_URL}/business/dashboard`, 'Open my dashboard')}
  `;
  await transport.sendMail({
    from: process.env.EMAIL_FROM || 'DealLink <no-reply@deallink.co>',
    to,
    subject: `${opts.creatorName} accepted your brief — ${opts.product}`,
    html: layout(content),
  });
}

export async function sendDealActivatedEmail(
  to: string,
  opts: { name: string; product: string; company: string; dealValue: number }
) {
  if (!isEmailConfigured()) return;
  const content = `
    <h1 style="margin:0 0 12px;font-size:22px;color:#0F1B33;">Your deal is live, ${opts.name.split(' ')[0]}!</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#54637D;line-height:1.7;">
      <strong>${opts.company}</strong> confirmed the <strong>${opts.product}</strong> deal
      at <strong>$${opts.dealValue.toLocaleString()}</strong>. Time to create something great.
    </p>
    ${button(`${process.env.APP_URL}/creator/dashboard`, 'Open my dashboard')}
  `;
  await transport.sendMail({
    from: process.env.EMAIL_FROM || 'DealLink <no-reply@deallink.co>',
    to,
    subject: `Your ${opts.product} deal is live`,
    html: layout(content),
  });
}

export async function sendDealCompletedEmail(
  to: string,
  opts: { businessName: string; product: string; creatorName: string }
) {
  if (!isEmailConfigured()) return;
  const content = `
    <h1 style="margin:0 0 12px;font-size:22px;color:#0F1B33;">Content delivered!</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#54637D;line-height:1.7;">
      <strong>${opts.creatorName}</strong> marked the <strong>${opts.product}</strong> deal as
      completed. Review the content and mark the deal as paid from your dashboard.
    </p>
    ${button(`${process.env.APP_URL}/business/dashboard`, 'Review deal')}
  `;
  await transport.sendMail({
    from: process.env.EMAIL_FROM || 'DealLink <no-reply@deallink.co>',
    to,
    subject: `${opts.creatorName} completed the ${opts.product} deal`,
    html: layout(content),
  });
}

export async function sendDealPaidEmail(
  to: string,
  opts: { name: string; product: string; company: string; amount: number }
) {
  if (!isEmailConfigured()) return;
  const content = `
    <h1 style="margin:0 0 12px;font-size:22px;color:#0F1B33;">You got paid! 🎉</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#54637D;line-height:1.7;">
      <strong>${opts.company}</strong> marked the <strong>${opts.product}</strong> deal as paid
      — <strong>$${opts.amount.toLocaleString()}</strong>. Great work, ${opts.name.split(' ')[0]}!
    </p>
    ${button(`${process.env.APP_URL}/creator/dashboard`, 'Open my dashboard')}
  `;
  await transport.sendMail({
    from: process.env.EMAIL_FROM || 'DealLink <no-reply@deallink.co>',
    to,
    subject: `You got paid — ${opts.product}`,
    html: layout(content),
  });
}
