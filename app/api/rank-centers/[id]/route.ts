import { requireAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/route";
import { serializeRankCenter } from "@/lib/serializers";
import { rankCenterSchema } from "@/lib/validation";

async function findOwnedRankCenter(id: string, userId: number) {
  return db.rankCenter.findFirst({
    where: { id, userId },
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuthenticatedUser(request);
    const rankCenter = await findOwnedRankCenter(params.id, user.id);
    if (!rankCenter) {
      return fail("Rank center not found.", "RANK_CENTER_NOT_FOUND", 404);
    }

    return ok({
      rank_center: serializeRankCenter(rankCenter),
    });
  } catch (error) {
    return fail("Unable to load rank center.", "RANK_CENTER_FETCH_FAILED", 401, error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = rankCenterSchema.parse(await request.json());
    const existing = await findOwnedRankCenter(params.id, user.id);
    if (!existing) {
      return fail("Rank center not found.", "RANK_CENTER_NOT_FOUND", 404);
    }

    const updated = await db.rankCenter.update({
      where: { id: params.id },
      data: {
        name: body.name,
        groupId: body.group_id,
        universeId: body.universe_id || null,
        ranksJson: JSON.stringify(body.ranks),
      },
    });

    return ok({
      rank_center: serializeRankCenter(updated),
    });
  } catch (error) {
    return fail("Unable to update rank center.", "RANK_CENTER_UPDATE_FAILED", 400, error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuthenticatedUser(request);
    const existing = await findOwnedRankCenter(params.id, user.id);
    if (!existing) {
      return fail("Rank center not found.", "RANK_CENTER_NOT_FOUND", 404);
    }

    await db.rankCenter.delete({
      where: { id: params.id },
    });

    return ok({
      message: "Rank center deleted.",
    });
  } catch (error) {
    return fail("Unable to delete rank center.", "RANK_CENTER_DELETE_FAILED", 400, error);
  }
}

