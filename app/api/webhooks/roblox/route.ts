import { fail, ok } from "@/lib/route";
import { robloxWebhookSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = robloxWebhookSchema.parse(await request.json());

    return ok({
      message: "Webhook received.",
      event: body.event,
      group_id: body.group_id,
    });
  } catch (error) {
    return fail("Unable to process webhook.", "ROBLOX_WEBHOOK_FAILED", 400, error);
  }
}
