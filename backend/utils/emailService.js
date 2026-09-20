// utils/emailService.js
const nodemailer = require("nodemailer");
const path = require("path");

// 🔥 TRANSPORTER
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const APP_URL = process.env.FRONTEND_URL || process.env.APP_URL || "http://localhost:3000";
const BRAND_NAME = "AI Olympiad";
const SUPPORT_EMAIL = "support@gridixa.in";

function formatDate(dateValue) {
  if (!dateValue) return "";
  return dateValue;
}

function emailShell({
  eyebrow,
  title,
  subtitle,
  leftTone = "#fff9e6",
  rightTone = "#ffffff",
  badgeText = "",
  body,
  ctaText,
  ctaUrl,
  footerNote,
}) {
  return `
  <div style="margin:0;padding:0;background:#fff9e6;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fff9e6;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="680" cellspacing="0" cellpadding="0" style="width:680px;max-width:680px;border:4px solid #000;background:#fff;box-shadow:10px 10px 0 #000;font-family:Arial,sans-serif;overflow:hidden;">
            
            <tr>
              <td style="background:#000;padding:18px 22px;">
                <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#ffd400;font-weight:900;">
                  ${eyebrow}
                </div>
                <div style="font-size:28px;line-height:1.05;font-weight:900;text-transform:uppercase;color:#fff;margin-top:6px;">
                  ${title}
                </div>
                <div style="color:#fff;font-size:13px;font-weight:700;margin-top:8px;line-height:1.5;">
                  ${subtitle}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:0;">
                ${body}
              </td>
            </tr>

            ${
              ctaText && ctaUrl
                ? `
            <tr>
              <td style="padding:0 22px 22px 22px;">
                <a href="${ctaUrl}" style="display:inline-block;background:#f7c800;color:#000;text-decoration:none;font-weight:900;text-transform:uppercase;padding:14px 20px;border:4px solid #000;box-shadow:6px 6px 0 #000;">
                  ${ctaText}
                </a>
              </td>
            </tr>`
                : ""
            }

            <tr>
              <td style="padding:0 22px 22px 22px;">
                <div style="font-size:12px;color:#444;line-height:1.6;">
                  ${footerNote || `— Team Gridixa`}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

function studentPendingPaymentTemplate({ name }) {
  return emailShell({
    eyebrow: "Registration Complete",
    title: `Welcome, ${name || "Student"}`,
    subtitle:
      "Your account has been created. One final step remains: complete the payment to unlock your dashboard.",
    body: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:4px solid #000;">
        <tr>
          <td style="padding:22px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td valign="top" style="width:56%;padding-right:14px;">
                  <div style="background:#fff9e6;border:4px solid #000;padding:18px;">
                    <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Next Step</div>
                    <div style="font-size:22px;line-height:1.15;font-weight:900;margin-bottom:10px;">
                      Complete payment to unlock your learning space.
                    </div>
                    <div style="font-size:14px;line-height:1.7;color:#222;">
                      After payment, your dashboard will open with modules, tests, progress tracking, and AI learning tasks.
                    </div>
                  </div>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:14px;">
                    <tr>
                      <td style="width:33.33%;padding-right:8px;">
                        <div style="border:4px solid #000;background:#ffd400;padding:12px;min-height:92px;">
                          <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Study</div>
                          <div style="font-size:15px;font-weight:900;line-height:1.2;margin-top:8px;">Structured modules designed for growth</div>
                        </div>
                      </td>
                      <td style="width:33.33%;padding-right:8px;">
                        <div style="border:4px solid #000;background:#59a7ff;padding:12px;min-height:92px;">
                          <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Practice</div>
                          <div style="font-size:15px;font-weight:900;line-height:1.2;margin-top:8px;">Real tests and challenge rounds</div>
                        </div>
                      </td>
                      <td style="width:33.33%;">
                        <div style="border:4px solid #000;background:#ff4fa3;padding:12px;min-height:92px;">
                          <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Apply</div>
                          <div style="font-size:15px;font-weight:900;line-height:1.2;margin-top:8px;">Use AI knowledge in creative tasks</div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>

                <td valign="top" style="width:44%;padding-left:14px;">
                  <div style="border:4px solid #000;background:#ffffff;padding:18px;">
                    <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Your access journey</div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:10px;border:4px solid #000;background:#fff9e6;font-weight:900;">1. Study Modules</td>
                      </tr>
                      <tr><td style="height:10px;"></td></tr>
                      <tr>
                        <td style="padding:10px;border:4px solid #000;background:#fff9e6;font-weight:900;">2. Take Tests</td>
                      </tr>
                      <tr><td style="height:10px;"></td></tr>
                      <tr>
                        <td style="padding:10px;border:4px solid #000;background:#fff9e6;font-weight:900;">3. Apply AI Knowledge</td>
                      </tr>
                    </table>
                  </div>

                  <div style="margin-top:14px;border:4px solid #000;background:#000;color:#fff;padding:16px;">
                    <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:900;color:#ffd400;">Payment Pending</div>
                    <div style="font-size:22px;line-height:1.15;font-weight:900;margin-top:8px;">₹199 unlocks the full experience.</div>
                    <div style="font-size:13px;line-height:1.6;margin-top:10px;color:#f3f3f3;">
                      Once payment is complete, you will receive your invoice and full dashboard access.
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
    ctaText: "Complete Payment",
    ctaUrl: `${APP_URL}/login`,
    footerNote: `If you have any questions, just reply to this mail or reach us at ${SUPPORT_EMAIL}.`,
  });
}

function studentPaymentSuccessTemplate({
    name,
    invoiceNumber,
    date,
    subtotalAmount,
    gstAmount,
    discountAmount,
    payableAmount,
    couponCode
  }) {
    return emailShell({
      eyebrow: "Payment Confirmed",
      title: `You're In, ${name || "Student"}!`,
      subtitle:
        "Your payment has been verified. You can now start studying, taking tests, and applying AI knowledge inside the dashboard.",
      body: `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding:22px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td valign="top" style="width:58%;padding-right:14px;">
                    <div style="border:4px solid #000;background:#fff9e6;padding:18px;">
                      <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Welcome aboard</div>
                      <div style="font-size:24px;line-height:1.12;font-weight:900;margin-top:8px;">
                        Your dashboard is now unlocked.
                      </div>
                      <div style="font-size:14px;line-height:1.7;margin-top:10px;color:#222;">
                        Start with modules, move into tests, and use the AI ideas and problem-solving tasks to keep building momentum.
                      </div>
                    </div>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:14px;">
                      <tr>
                        <td style="width:50%;padding-right:8px;">
                          <div style="border:4px solid #000;background:#59a7ff;padding:14px;min-height:108px;">
                            <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Study Modules</div>
                            <div style="font-size:15px;font-weight:900;line-height:1.25;margin-top:8px;">Learn in a structured path with your own pace.</div>
                          </div>
                        </td>
                        <td style="width:50%;">
                          <div style="border:4px solid #000;background:#ff4fa3;padding:14px;min-height:108px;">
                            <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:#fff;">Take Tests</div>
                            <div style="font-size:15px;font-weight:900;line-height:1.25;margin-top:8px;color:#fff;">Practice with real assessments and review progress.</div>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <div style="margin-top:14px;border:4px solid #000;background:#19d56b;padding:14px;">
                      <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Apply AI Knowledge</div>
                      <div style="font-size:15px;font-weight:900;line-height:1.3;margin-top:8px;">
                        Use what you learn in experiments, tasks, and creative problem solving.
                      </div>
                    </div>
                  </td>

                  <td valign="top" style="width:42%;padding-left:14px;">
                    <div style="border:4px solid #000;background:#ffffff;padding:18px;">
                      <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Payment details</div>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="padding:10px;border:4px solid #000;background:#ffd400;font-weight:900;">Invoice #</td>
                        </tr>
                        <tr>
                          <td style="padding:10px;border-left:4px solid #000;border-right:4px solid #000;border-bottom:4px solid #000;">
                            ${invoiceNumber || "N/A"}
                          </td>
                        </tr>
                        <tr><td style="height:10px;"></td></tr>
                        <tr>
                          <td style="padding:10px;border:4px solid #000;background:#ffd400;font-weight:900;">Date</td>
                        </tr>
                        <tr>
                          <td style="padding:10px;border-left:4px solid #000;border-right:4px solid #000;border-bottom:4px solid #000;">
                            ${formatDate(date)}
                          </td>
                        </tr>
                      </table>
                    </div>

                    <div style="margin-top:14px;border:4px solid #000;background:#fff;padding:16px;">
                      <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Payment Summary</div>

                      <div style="font-size:14px;line-height:1.7;color:#222;">
                        <div><strong>Base Amount:</strong> ₹199</div>
                        <div><strong>Discount:</strong> -₹${(Number(discountAmount || 0) / 100).toFixed(2)}</div>
                        <div><strong>Subtotal:</strong> ₹${(Number(subtotalAmount || 0) / 100).toFixed(2)}</div>
                        <div><strong>GST:</strong> ₹${(Number(gstAmount || 0) / 100).toFixed(2)}</div>
                        <div><strong>Payable:</strong> ₹${(Number(payableAmount || 0) / 100).toFixed(2)}</div>
                        ${couponCode ? `<div><strong>Coupon Used:</strong> ${couponCode}</div>` : ""}
                      </div>
                    </div>

                    <div style="margin-top:14px;border:4px solid #000;background:#fff9e6;padding:16px;">
                      <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Your next move</div>
                      <div style="font-size:18px;line-height:1.25;font-weight:900;margin-top:8px;">
                        Log in now and begin with Module 1.
                      </div>
                      <div style="font-size:13px;line-height:1.6;margin-top:8px;color:#222;">
                        The full AI Olympiad journey is ready for you. Pick up where the learning begins.
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
    ctaText: "Login Now",
    ctaUrl: `${APP_URL}/login`,
    footerNote: `Invoice attached. If you need help, reply to this email or contact ${SUPPORT_EMAIL}.`,
  });
}

function parentPaymentSuccessTemplate({ childName, invoiceNumber, date, payableAmount }) {
  return emailShell({
    eyebrow: "Parent Update",
    title: "Your Child’s Registration Is Complete",
    subtitle:
      "We are happy to inform you that the payment has been confirmed and your child is now enrolled in AI Olympiad.",
    body: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding:22px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td valign="top" style="width:56%;padding-right:14px;">
                  <div style="border:4px solid #000;background:#fff9e6;padding:18px;">
                    <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">What this means</div>
                    <div style="font-size:24px;line-height:1.12;font-weight:900;margin-top:8px;">
                      A structured AI learning journey has begun.
                    </div>
                    <div style="font-size:14px;line-height:1.7;margin-top:10px;color:#222;">
                      Your child will now be able to study modules, attempt tests, and apply AI knowledge in a guided, competition-focused format.
                    </div>
                  </div>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:14px;">
                    <tr>
                      <td style="width:33.33%;padding-right:8px;">
                        <div style="border:4px solid #000;background:#ffd400;padding:12px;min-height:102px;">
                          <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Support</div>
                          <div style="font-size:14px;font-weight:900;line-height:1.25;margin-top:8px;">Encourage regular study sessions</div>
                        </div>
                      </td>
                      <td style="width:33.33%;padding-right:8px;">
                        <div style="border:4px solid #000;background:#59a7ff;padding:12px;min-height:102px;">
                          <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Consistency</div>
                          <div style="font-size:14px;font-weight:900;line-height:1.25;margin-top:8px;">Help them stay active on the platform</div>
                        </div>
                      </td>
                      <td style="width:33.33%;">
                        <div style="border:4px solid #000;background:#19d56b;padding:12px;min-height:102px;">
                          <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Growth</div>
                          <div style="font-size:14px;font-weight:900;line-height:1.25;margin-top:8px;">Track progress and celebrate improvement</div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>

                <td valign="top" style="width:44%;padding-left:14px;">
                  <div style="border:4px solid #000;background:#ffffff;padding:18px;">
                    <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Registration summary</div>
                    <div style="padding:12px;border:4px solid #000;background:#ffd400;font-weight:900;margin-bottom:10px;">
                      Child: ${childName || "Student"}
                    </div>
                    <div style="padding:12px;border:4px solid #000;background:#fff9e6;font-weight:900;margin-bottom:10px;">
                      Invoice #: ${invoiceNumber || "N/A"}
                    </div>
                    <div style="padding:12px;border:4px solid #000;background:#fff9e6;font-weight:900;margin-bottom:10px;">
                      Date: ${formatDate(date)}
                    </div>
                  </div>

                  <div style="margin-top:14px;border:4px solid #000;background:#ff4fa3;padding:16px;color:#fff;">
                    <div style="font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Why this matters</div>
                    <div style="font-size:18px;line-height:1.25;font-weight:900;margin-top:8px;">
                      Regular participation helps children stay curious, disciplined, and confident.
                    </div>
                    <div style="font-size:13px;line-height:1.6;margin-top:8px;">
                      A little encouragement goes a long way in helping them revisit the platform and keep learning consistently.
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
    ctaText: "Visit Portal",
    ctaUrl: `${APP_URL}/login`,
    footerNote: `Thank you for supporting ${childName || "your child"} on this journey. The invoice is attached for your records.`,
  });
}

// 📩 STEP 3: STUDENT EMAIL
exports.sendWelcomePendingPaymentEmail = async (email, name) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `🚀 Welcome to ${BRAND_NAME} — Complete Your Payment`,
    html: studentPendingPaymentTemplate({ name }),
    replyTo: SUPPORT_EMAIL,
  });
};

// 📩 STUDENT PAYMENT SUCCESS EMAIL + INVOICE
exports.sendStudentPaymentSuccessEmail = async ({
  email,
  name,
  invoicePath,
  invoiceNumber,
  date,
  subtotalAmount,
  gstAmount,
  discountAmount,
  payableAmount,
  couponCode,
}) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `🎉 Welcome to the AI Olympiad — Start Your Learning Journey`,
    html: studentPaymentSuccessTemplate({
      name,
      invoiceNumber,
      date,
      subtotalAmount,
      gstAmount,
      discountAmount,
      payableAmount,
      couponCode,
    }),
    replyTo: SUPPORT_EMAIL,
    attachments: [
      {
        filename: path.basename(invoicePath || "invoice.pdf"),
        path: invoicePath,
      },
    ],
  });
};

// 📩 PARENT PAYMENT SUCCESS EMAIL + INVOICE
exports.sendParentPaymentSuccessEmail = async ({
  parentEmail,
  childName,
  invoicePath,
  invoiceNumber,
  date,
  payableAmount,
}) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: parentEmail,
    subject: `✅ ${childName || "Your child"} has successfully registered for ${BRAND_NAME}`,
    html: parentPaymentSuccessTemplate({ childName, invoiceNumber, date }),
    replyTo: SUPPORT_EMAIL,
    attachments: [
      {
        filename: path.basename(invoicePath || "invoice.pdf"),
        path: invoicePath,
      },
    ],
  });
};