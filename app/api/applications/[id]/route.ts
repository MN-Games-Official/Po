import { requireAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/route";
import { serializeApplication } from "@/lib/serializers";
import { applicationSchema } from "@/lib/validation";

async function findOwnedApplication(id: string, userId: number) {
  return db.application.findFirst({
    where: { id, userId },
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuthenticatedUser(request);
    const application = await findOwnedApplication(params.id, user.id);
    if (!application) {
      return fail("Application not found.", "APPLICATION_NOT_FOUND", 404);
    }

    return ok({
      application: serializeApplication(application),
    });
  } catch (error) {
    return fail("Unable to load application.", "APPLICATION_FETCH_FAILED", 401, error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuthenticatedUser(request);
    const body = applicationSchema.parse(await request.json());
    const existing = await findOwnedApplication(params.id, user.id);
    if (!existing) {
      return fail("Application not found.", "APPLICATION_NOT_FOUND", 404);
    }

    const application = await db.application.update({
      where: { id: params.id },
      data: {
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

    return ok({
      application: serializeApplication(application),
    });
  } catch (error) {
    return fail("Unable to update application.", "APPLICATION_UPDATE_FAILED", 400, error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuthenticatedUser(request);
    const existing = await findOwnedApplication(params.id, user.id);
    if (!existing) {
      return fail("Application not found.", "APPLICATION_NOT_FOUND", 404);
    }

    await db.application.delete({
      where: { id: params.id },
    });

    return ok({
      message: "Application deleted.",
    });
  } catch (error) {
    return fail("Unable to delete application.", "APPLICATION_DELETE_FAILED", 400, error);
  }
}

