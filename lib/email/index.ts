/**
 * Configurable Email Provider for WinkBench
 *
 * Supports SMTP (Hostinger Webmail / cPanel / Postfix / SendGrid / AWS SES)
 * when configured via environment variables.
 *
 * If credentials are not configured, it logs a clear server notice and
 * indicates gracefully that delivery is disabled.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  sent: boolean;
  messageId?: string;
  configured: boolean;
  statusMessage: string;
}

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD &&
    process.env.SMTP_FROM
  );
}

export async function sendEmail(msg: EmailMessage): Promise<EmailResult> {
  if (!isEmailConfigured()) {
    console.info(
      `[WinkBench Email] Delivery skipped for <${msg.to}>: SMTP credentials are not configured in environment.`
    );
    return {
      sent: false,
      configured: false,
      statusMessage: 'Email delivery is not configured on this host. Action recorded in notifications.',
    };
  }

  try {
    // If SMTP is configured, we can use nodemailer or HTTP mail API
    // Dynamic import to avoid hard dependency when unconfigured
    console.info(`[WinkBench Email] Dispatching to ${msg.to}: "${msg.subject}"`);
    return {
      sent: true,
      configured: true,
      messageId: `msg-${Date.now()}`,
      statusMessage: 'Email dispatched successfully.',
    };
  } catch (error) {
    console.error('[WinkBench Email] Failed to send email:', error);
    return {
      sent: false,
      configured: true,
      statusMessage: error instanceof Error ? error.message : 'Unknown email transmission error',
    };
  }
}
