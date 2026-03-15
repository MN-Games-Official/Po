"use client";

import { ApiKeyDisplay } from "@/components/api-keys/ApiKeyDisplay";
import { PolarisKeyGenerator } from "@/components/api-keys/PolarisKeyGenerator";
import { RobloxKeyUpload } from "@/components/api-keys/RobloxKeyUpload";
import { Loading } from "@/components/ui/Loading";
import { useApiKeys } from "@/hooks/useApiKeys";

export function ApiKeysDashboard() {
  const { apiKeys, loading } = useApiKeys();

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <RobloxKeyUpload />
        <PolarisKeyGenerator />
      </div>
      {loading ? (
        <Loading label="Loading API keys" />
      ) : (
        <ApiKeyDisplay title="Issued API keys" keys={apiKeys} />
      )}
    </div>
  );
}
