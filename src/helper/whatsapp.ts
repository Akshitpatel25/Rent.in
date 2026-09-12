/**
 * WhatsApp Business Cloud API Helper
 * 
 * Sends template messages via Meta's WhatsApp Cloud API.
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates
 * 
 * Required ENV vars:
 * - WHATSAPP_PHONE_NUMBER_ID: Your WhatsApp Business phone number ID
 * - WHATSAPP_ACCESS_TOKEN: Permanent access token from Meta Business Manager
 * - WHATSAPP_TENANT_TEMPLATE: Template name for tenant bill notification
 * - WHATSAPP_OWNER_TEMPLATE: Template name for owner monthly summary
 */

const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";

interface TenantBillParams {
  tenantPhone: string;       // 10-digit Indian number
  tenantName: string;
  monthYear: string;         // e.g. "JAN2026"
  monthlyRent: string;       // e.g. "3500"
  electricityBill: string;   // e.g. "450"
  totalAmount: string;       // e.g. "3950"
  ownerName: string;
}

interface OwnerSummaryParams {
  ownerPhone: string;        // 10-digit Indian number
  ownerName: string;
  monthYear: string;
  unpaidList: string;        // Formatted list of unpaid tenants
  totalRemaining: string;    // Total remaining amount
}

/**
 * Send a template message via WhatsApp Cloud API
 */
async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode: string,
  components: any[]
) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.log("WhatsApp API credentials not configured, skipping message");
    return { success: false, error: "WhatsApp not configured" };
  }

  // Format phone: ensure it has country code
  const formattedPhone = to.startsWith("91") ? to : `91${to}`;

  try {
    const res = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          components: components,
        },
      }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log(`WhatsApp message sent to ${formattedPhone}:`, data);
      return { success: true, data };
    } else {
      console.error(`WhatsApp API error:`, data);
      return { success: false, error: data.error?.message || "Failed to send" };
    }
  } catch (error: any) {
    console.error("WhatsApp send error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send bill notification to tenant
 * Triggered when owner creates monthly rent with meter reading
 */
export async function sendTenantBillNotification(params: TenantBillParams) {
  const templateName = process.env.WHATSAPP_TENANT_TEMPLATE || "tenant_bill_notification";

  const components = [
    {
      type: "body",
      parameters: [
        { type: "text", text: params.tenantName },
        { type: "text", text: params.monthYear },
        { type: "text", text: params.monthlyRent },
        { type: "text", text: params.electricityBill },
        { type: "text", text: params.totalAmount },
        { type: "text", text: params.ownerName },
      ],
    },
  ];

  return sendWhatsAppTemplate(params.tenantPhone, templateName, "en", components);
}

/**
 * Send monthly summary to owner
 * Triggered on 1st of every month via cron
 */
export async function sendOwnerMonthlySummary(params: OwnerSummaryParams) {
  const templateName = process.env.WHATSAPP_OWNER_TEMPLATE || "owner_monthly_summary";

  const components = [
    {
      type: "body",
      parameters: [
        { type: "text", text: params.ownerName },
        { type: "text", text: params.monthYear },
        { type: "text", text: params.unpaidList },
        { type: "text", text: params.totalRemaining },
      ],
    },
  ];

  return sendWhatsAppTemplate(params.ownerPhone, templateName, "en", components);
}
