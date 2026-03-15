import { z } from "zod";

import { requireAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/route";
import { serializeRankCenter } from "@/lib/serializers";
import { rankEntrySchema } from "@/lib/validation";

const importSchema = z.object({
  mode: z.enum(["replace", "merge"]),
  ranks: z.array(rankEntrySchema),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = importSchema.parse(await request.json());

    const rankCenter = await db.rankCenter.findFirst({
      where: { id: params.id, userId: user.id },
    });
    if (!rankCenter) {
      return fail("Rank center not found.", "RANK_CENTER_NOT_FOUND", 404);
    }

    const currentRanks = JSON.parse(rankCenter.ranksJson) as Array<unknown>;
    const merged = body.mode === "replace" ? body.ranks : [...currentRanks, ...body.ranks];

    const updated = await db.rankCenter.update({
      where: { id: params.id },
      data: { ranksJson: JSON.stringify(merged) },
    });

    return ok({
      rank_center: serializeRankCenter(updated),
    });
  } catch (error) {
    return fail("Unable to import ranks.", "RANK_CENTER_IMPORT_FAILED", 400, error);
  }
}
