import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ProfileForm />
      <PasswordChangeForm />
    </div>
  );
}

