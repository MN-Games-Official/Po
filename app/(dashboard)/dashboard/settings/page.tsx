import { Alert } from "@/components/ui/Alert";
import { Card, CardHeader } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader
        title="Settings"
        subtitle="Reserved for upcoming configuration and operational controls."
      />
      <Alert title="Not yet expanded" tone="info">
        The settings area is scaffolded for future SMTP templates, audit logging,
        RBAC, and deployment tuning.
      </Alert>
    </Card>
  );
}
