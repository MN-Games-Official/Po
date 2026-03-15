import { RankCenterBuilder } from "@/components/rank-center/RankCenterBuilder";

export default function EditRankCenterPage({
  params,
}: {
  params: { id: string };
}) {
  return <RankCenterBuilder rankCenterId={params.id} />;
}

