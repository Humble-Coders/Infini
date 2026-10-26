import "server-only";

import nodemailer from "nodemailer";

/**
 * "New enquiry" email to the INFINI team. Runs only after the lead is safely
 * in Firestore: the outcome is recorded on the lead and
 * surfaced in the admin dashboard, so a silent SMTP outage is visible instead
 * of losing enquiries.
 *
 * Configured entirely through server-only env vars (never NEXT_PUBLIC_):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (e.g. a Google App Password),
 *   LEAD_NOTIFY_TO (comma-separated), optional SMTP_FROM.
 */
export interface LeadForEmail {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  industry: string | null;
  message: string;
  imageUrl: string | null;
}

export type NotificationResult = { status: "sent" } | { status: "failed"; error: string } | { status: "not_configured" };

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function smtpTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT) || 465;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 8000,
    socketTimeout: 10000,
  });
}

export async function sendLeadNotification(lead: LeadForEmail): Promise<NotificationResult> {
  const { SMTP_USER, LEAD_NOTIFY_TO, SMTP_FROM, ADMIN_DASHBOARD_URL } = process.env;
  const transport = smtpTransport();
  if (!transport || !LEAD_NOTIFY_TO) return { status: "not_configured" };

  const rows: Array<[string, string | null]> = [
    ["Name", lead.name],
    ["Company", lead.company],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Industry", lead.industry],
  ];
  const adminLink = ADMIN_DASHBOARD_URL ? `${ADMIN_DASHBOARD_URL.replace(/\/$/, "")}/admin/leads` : null;

  const text = [
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    "",
    lead.message,
    lead.imageUrl ? `\nAttachment: ${lead.imageUrl}` : "",
    adminLink ? `\nOpen in the dashboard: ${adminLink}` : "",
  ].join("\n");

  const html = `
    <table cellpadding="4" style="font-family:Arial,sans-serif;font-size:14px">
      ${rows
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><strong>${escapeHtml(String(v))}</strong></td></tr>`)
        .join("")}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(lead.message)}</p>
    ${lead.imageUrl ? `<p><a href="${escapeHtml(lead.imageUrl)}">View the attached image</a></p>` : ""}
    ${adminLink ? `<p><a href="${escapeHtml(adminLink)}">Open this enquiry in the INFINI dashboard</a></p>` : ""}`;

  try {
    await transport.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: LEAD_NOTIFY_TO.split(",").map((address) => address.trim()).filter(Boolean),
      replyTo: lead.email,
      subject: `New website enquiry: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
      text,
      html,
    });
    return { status: "sent" };
  } catch (error) {
    const message = (error as Error)?.message?.slice(0, 200) || "Unknown SMTP error";
    console.error("[lead-notification] send failed:", message);
    return { status: "failed", error: message };
  }
}

/** Emails a Firebase password-reset link to a team member. */
export async function sendPasswordResetEmail(to: string, link: string): Promise<NotificationResult> {
  const transport = smtpTransport();
  if (!transport) return { status: "not_configured" };
  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: "Reset your INFINI admin password",
      text: `Use this link to choose a new password for the INFINI admin dashboard:

${link}

If you didn't ask for this, you can ignore this email.`,
      html: `<p style="font-family:Arial,sans-serif;font-size:14px">Use this link to choose a new password for the INFINI admin dashboard:</p>
        <p><a href="${escapeHtml(link)}">Reset my password</a></p>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#666">If you didn't ask for this, you can ignore this email.</p>`,
    });
    return { status: "sent" };
  } catch (error) {
    const message = (error as Error)?.message?.slice(0, 200) || "Unknown SMTP error";
    console.error("[password-reset] send failed:", message);
    return { status: "failed", error: message };
  }
}
