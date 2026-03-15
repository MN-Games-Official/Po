import { requireAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/route";
import {
  serializeApplication,
  serializeApplicationListItem,
} from "@/lib/serializers";
import { applicationSchema } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const applications = await db.application.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        submissions: {
          select: {
            passed: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    return ok({
      applications: applications.map(serializeApplicationListItem),
    });
  } catch (error) {
    return fail("Unable to fetch applications.", "APPLICATIONS_FETCH_FAILED", 401, error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = applicationSchema.parse(await request.json());
    const application = await db.application.create({
      data: {
        userId: user.id,
        name: body.name,
        description: body.description || null,
        groupId: body.group_id,
        targetRole: body.target_role,
        passScore: Math.floor(body.pass_score),
        primaryColor: body.style.primary_color,
        secondaryColor: body.style.secondary_color,
        questionsJson: JSON.stringify(body.questions),
        styleJson: JSON.stringify(body.style),
      },
    });

    return ok(
      {
        application: serializeApplication(application),
      },
      { status: 201 },
    );
  } catch (error) {
    return fail("Unable to create application.", "APPLICATION_CREATE_FAILED", 400, error);
  }
}

