import { ApplicationBuilder } from "@/components/applications/ApplicationBuilder";

export default function EditApplicationPage({
  params,
}: {
  params: { id: string };
}) {
  return <ApplicationBuilder applicationId={params.id} />;
}

