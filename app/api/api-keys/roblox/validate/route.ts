import { config } from "@/lib/config";
import { fail, ok } from "@/lib/route";
import { formatKeyPreview } from "@/lib/utils";
import { robloxApiKeySchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = robloxApiKeySchema.parse(await request.json());

    const response = await fetch(
      `${config.roblox.cloudBase}/cloud/v2/groups/1/memberships?maxPageSize=1`,
      {
        headers: {
          "x-api-key": body.api_key,
        },
      },
    );

    if (response.status === 401 || response.status === 403) {
      return fail("Roblox API key was rejected.", "ROBLOX_KEY_INVALID", 400);
    }

    return ok({
      message: "API key validated.",
      preview: formatKeyPreview(body.api_key),
    });
  } catch (error) {
    return fail("Unable to validate Roblox API key.", "ROBLOX_VALIDATE_FAILED", 400, error);
  }
}

