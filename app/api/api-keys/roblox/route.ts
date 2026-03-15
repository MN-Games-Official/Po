import { requireAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { encryptKey } from "@/lib/encryption";
import { fail, ok } from "@/lib/route";
import { formatKeyPreview } from "@/lib/utils";
import { robloxApiKeySchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = robloxApiKeySchema.parse(await request.json());

    if (body.validate) {
      const validation = await fetch(`${new URL(request.url).origin}/api/api-keys/roblox/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!validation.ok) {
        const payload = (await validation.json()) as { error?: string };
        return fail(
          payload.error || "Roblox API key validation failed.",
          "ROBLOX_KEY_INVALID",
          400,
        );
      }
    }

    const existing = await db.apiKey.findFirst({
      where: {
        userId: user.id,
        type: "roblox",
      },
    });

    const preview = formatKeyPreview(body.api_key);
    const data = {
      userId: user.id,
      type: "roblox",
      name: "Roblox Cloud",
      encryptedKey: encryptKey(body.api_key),
      keyPrefix: preview,
      isActive: true,
    };

    if (existing) {
      await db.apiKey.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await db.apiKey.create({ data });
    }

    return ok({
      message: "API key validated and saved",
      preview,
    });
  } catch (error) {
    return fail("Unable to save Roblox API key.", "ROBLOX_KEY_SAVE_FAILED", 400, error);
  }
}

