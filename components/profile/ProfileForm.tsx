"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ProfilePicture } from "@/components/profile/ProfilePicture";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import { profileUpdateSchema } from "@/lib/validation";

type ProfileValues = z.infer<typeof profileUpdateSchema>;

export function ProfileForm() {
  const { user, updateProfile } = useUser();
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileUpdateSchema),
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    reset({
      full_name: user.full_name || "",
      avatar_url: user.avatar_url || "",
    });
  }, [reset, user]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateProfile(values);
      push({
        title: "Profile updated",
        description: "Your operator profile has been saved.",
        tone: "success",
      });
    } catch (error) {
      push({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "danger",
      });
    }
  });

  return (
    <Card>
      <CardHeader
        title="Profile"
        subtitle="Manage your identity, display name, and avatar source."
      />
      <div className="mb-6 flex items-center gap-5">
        <ProfilePicture src={user?.avatar_url} />
        <div>
          <div className="text-lg font-medium text-text">
            {user?.full_name || user?.username || "Operator"}
          </div>
          <div className="text-sm text-textMuted">{user?.email}</div>
        </div>
      </div>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <Input
          label="Full name"
          error={errors.full_name?.message}
          {...register("full_name")}
        />
        <Input
          label="Avatar URL"
          error={errors.avatar_url?.message}
          {...register("avatar_url")}
        />
        <div className="md:col-span-2">
          <Button type="submit" loading={isSubmitting}>
            Save profile
          </Button>
        </div>
      </form>
    </Card>
  );
}

