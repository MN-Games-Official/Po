import { requireAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/route";
import {
  serializeRankCenter,
  serializeRankCenterListItem,
} from "@/lib/serializers";
import { rankCenterSchema } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const rankCenters = await db.rankCenter.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return ok({
      rank_centers: rankCenters.map(serializeRankCenterListItem),
    });
  } catch (error) {
    return fail("Unable to fetch rank centers.", "RANK_CENTER_FETCH_FAILED", 401, error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = rankCenterSchema.parse(await request.json());

    const rankCenter = await db.rankCenter.create({
      data: {
        userId: user.id,
        name: body.name,
        groupId: body.group_id,
        universeId: body.universe_id || null,
        ranksJson: JSON.stringify(body.ranks),
      },
    });

    return ok(
      {
        rank_center: serializeRankCenter(rankCenter),
      },
      { status: 201 },
    );
  } catch (error) {
    return fail("Unable to create rank center.", "RANK_CENTER_CREATE_FAILED", 400, error);
  }
}

