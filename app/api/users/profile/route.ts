import { requireAuthenticatedUser } from "@/lib/auth";
import { ok, fail } from "@/lib/route";
import { serializeUser } from "@/lib/serializers";

export async function GET(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    return ok({
      user: serializeUser(user),
    });
  } catch (error) {
    return fail("Unable to load profile.", "PROFILE_FETCH_FAILED", 401, error);
  }
}

