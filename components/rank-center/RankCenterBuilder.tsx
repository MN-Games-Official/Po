"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { RankPreview } from "@/components/rank-center/RankPreview";
import { RanksEditor } from "@/components/rank-center/RanksEditor";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Loading } from "@/components/ui/Loading";
import { useToast } from "@/hooks/useToast";
import { apiClient } from "@/lib/api-client";
import { DEFAULT_RANKS } from "@/lib/constants";
import { rankCenterSchema, rankEntrySchema } from "@/lib/validation";
import type { RankCenterDraft, RankEntry } from "@/types/domain";

const defaultDraft: RankCenterDraft = {
  name: "Premium Ranks",
  group_id: "",
  universe_id: "",
  ranks: DEFAULT_RANKS,
};

type FormValues = z.infer<typeof rankCenterSchema>;
type RankFormValues = z.infer<typeof rankEntrySchema>;

export function RankCenterBuilder({
  rankCenterId,
}: {
  rankCenterId?: string | null;
}) {
  const { push } = useToast();
  const [loading, setLoading] = useState(Boolean(rankCenterId));
  const [ranks, setRanks] = useState<RankEntry[]>(defaultDraft.ranks as RankEntry[]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRank, setEditingRank] = useState<RankEntry | null>(null);
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(rankCenterSchema),
    defaultValues: defaultDraft,
  });

  const rankForm = useForm<RankFormValues>({
    resolver: zodResolver(rankEntrySchema),
    defaultValues: DEFAULT_RANKS[0],
  });

  useEffect(() => {
    async function loadRankCenter() {
      if (!rankCenterId) {
        return;
      }

      try {
        setLoading(true);
        const data = await apiClient<{ rank_center: RankCenterDraft }>(
          `/api/rank-centers/${rankCenterId}`,
        );
        reset(data.rank_center);
        setRanks(data.rank_center.ranks);
      } catch (error) {
        push({
          title: "Unable to load rank center",
          description: error instanceof Error ? error.message : "Unknown error",
          tone: "danger",
        });
      } finally {
        setLoading(false);
      }
    }

    void loadRankCenter();
  }, [push, rankCenterId, reset]);

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    rankForm.reset(
      editingRank || {
        id: crypto.randomUUID(),
        rank_id: 1,
        gamepass_id: 0,
        name: "",
        description: "",
        price: 0,
        is_for_sale: false,
        regional_pricing: false,
      },
    );
  }, [editingRank, modalOpen, rankForm]);

  const values = watch();

  const onSubmit = handleSubmit(async (formValues) => {
    try {
      const payload = { ...formValues, ranks };
      const data = await apiClient<{ rank_center: RankCenterDraft }>(
        rankCenterId ? `/api/rank-centers/${rankCenterId}` : "/api/rank-centers",
        {
          method: rankCenterId ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
      );

      reset(data.rank_center);
      setRanks(data.rank_center.ranks);
      push({
        title: rankCenterId ? "Rank center updated" : "Rank center created",
        description: "Rank pricing and mappings are now saved.",
        tone: "success",
      });
    } catch (error) {
      push({
        title: "Unable to save rank center",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "danger",
      });
    }
  });

  if (loading) {
    return <Loading label="Loading rank center builder" />;
  }

  const preview: RankCenterDraft = {
    ...values,
    universe_id: values.universe_id || "",
    ranks,
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader
            title={rankCenterId ? "Edit Rank Center" : "Create Rank Center"}
            subtitle="Define the group, universe, and monetized rank entries."
            action={
              <div className="flex gap-3">
                <Button variant="ghost" href="/dashboard/rank-center">
                  Back to list
                </Button>
                <Button onClick={onSubmit} loading={isSubmitting}>
                  <Save className="h-4 w-4" />
                  Save rank center
                </Button>
              </div>
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Rank center name"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Group ID"
              error={errors.group_id?.message}
              {...register("group_id")}
            />
            <Input
              label="Universe ID"
              error={errors.universe_id?.message}
              {...register("universe_id")}
            />
          </div>
        </Card>

        <RanksEditor
          ranks={ranks}
          onAdd={() => {
            setEditingRank(null);
            setModalOpen(true);
          }}
          onEdit={(rank) => {
            setEditingRank(rank);
            setModalOpen(true);
          }}
          onRemove={(rankId) =>
            setRanks((current) => current.filter((rank) => rank.id !== rankId))
          }
        />
      </div>

      <RankPreview rankCenter={preview} />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRank ? "Edit rank entry" : "Add rank entry"}
      >
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={rankForm.handleSubmit((value) => {
            setRanks((current) => {
              const exists = current.some((rank) => rank.id === value.id);
              if (exists) {
                return current.map((rank) =>
                  rank.id === value.id ? value : rank,
                );
              }

              return [...current, value];
            });
            setModalOpen(false);
          })}
        >
          <Input
            label="Local ID"
            error={rankForm.formState.errors.id?.message}
            {...rankForm.register("id")}
          />
          <Input
            label="Rank ID"
            type="number"
            error={rankForm.formState.errors.rank_id?.message}
            {...rankForm.register("rank_id", { valueAsNumber: true })}
          />
          <Input
            label="Gamepass ID"
            type="number"
            error={rankForm.formState.errors.gamepass_id?.message}
            {...rankForm.register("gamepass_id", { valueAsNumber: true })}
          />
          <Input
            label="Price"
            type="number"
            error={rankForm.formState.errors.price?.message}
            {...rankForm.register("price", { valueAsNumber: true })}
          />
          <Input
            className="md:col-span-2"
            label="Name"
            error={rankForm.formState.errors.name?.message}
            {...rankForm.register("name")}
          />
          <Textarea
            className="md:col-span-2"
            label="Description"
            error={rankForm.formState.errors.description?.message}
            {...rankForm.register("description")}
          />
          <Select
            label="For sale"
            options={[
              { label: "No", value: "false" },
              { label: "Yes", value: "true" },
            ]}
            {...rankForm.register("is_for_sale", {
              setValueAs: (value) => value === "true",
            })}
          />
          <Select
            label="Regional pricing"
            options={[
              { label: "No", value: "false" },
              { label: "Yes", value: "true" },
            ]}
            {...rankForm.register("regional_pricing", {
              setValueAs: (value) => value === "true",
            })}
          />
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save rank</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
