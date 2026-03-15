import { requireAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashOpaqueToken } from "@/lib/encryption";
import { fail, ok } from "@/lib/route";
import { serializeApiKey } from "@/lib/serializers";
import { formatKeyPreview } from "@/lib/utils";
import { polarisApiKeySchema } from "@/lib/validation";

function generatePolarisKey() {
  return `polaris_${crypto.randomUUID().replace(/-/g, "")}`;
}

export async function GET(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const apiKeys = await db.apiKey.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { createdAt: "desc" },
    });

    return ok({
      api_keys: apiKeys.map(serializeApiKey),
    });
  } catch (error) {
    return fail("Unable to fetch API keys.", "API_KEYS_FETCH_FAILED", 401, error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = polarisApiKeySchema.parse(await request.json());
    const apiKey = generatePolarisKey();
    const preview = formatKeyPreview(apiKey);

    await db.apiKey.create({
      data: {
        userId: user.id,
        type: "polaris",
        name: body.name,
        encryptedKey: hashOpaqueToken(apiKey),
        keyPrefix: preview,
        scopesJson: JSON.stringify(body.scopes),
        expiresAt: new Date(Date.now() + body.expires_in * 1000),
        isActive: true,
      },
    });

    return ok(
      {
        api_key: apiKey,
        preview,
        message: "Copy this key now. You won't be able to see it again.",
      },
      { status: 201 },
    );
  } catch (error) {
    return fail("Unable to generate Polaris API key.", "POLARIS_KEY_GENERATE_FAILED", 400, error);
  }
}

