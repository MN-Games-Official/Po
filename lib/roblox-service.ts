import { config } from "@/lib/config";

export class RobloxService {
  constructor(private readonly apiKey: string) {}

  async getMembership(groupId: string, userId: string) {
    const filter = encodeURIComponent(`user=='users/${userId}'`);
    const url = `${config.roblox.cloudBase}/cloud/v2/groups/${groupId}/memberships?maxPageSize=1&filter=${filter}`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": this.apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to get membership (${response.status})`);
    }

    const data = (await response.json()) as {
      groupMemberships?: Array<{
        path: string;
        user: string;
        role: string;
      }>;
    };

    return data.groupMemberships?.[0] || null;
  }

  async getRolesMap(groupId: string) {
    const response = await fetch(
      `${config.roblox.groupsBase}/v1/groups/${groupId}/roles`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch roles (${response.status})`);
    }

    const data = (await response.json()) as {
      roles: Array<{ id: number; rank: number; name: string }>;
    };

    return data.roles.reduce<Record<number, number>>((acc, role) => {
      acc[role.rank] = role.id;
      return acc;
    }, {});
  }

  async promoteUser(
    groupId: string,
    membershipId: string,
    targetRole: string,
  ) {
    let rolePath = targetRole;

    if (targetRole.startsWith("rank:")) {
      const rank = Number(targetRole.split(":")[1]?.trim());
      const rolesMap = await this.getRolesMap(groupId);
      const roleId = rolesMap[rank];
      if (!roleId) {
        throw new Error(`Rank ${rank} was not found in group ${groupId}.`);
      }

      rolePath = `groups/${groupId}/roles/${roleId}`;
    } else if (/^\d+$/.test(targetRole)) {
      rolePath = `groups/${groupId}/roles/${targetRole}`;
    }

    const response = await fetch(
      `${config.roblox.cloudBase}/cloud/v2/groups/${groupId}/memberships/${membershipId}`,
      {
        method: "PATCH",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: rolePath }),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Promotion failed (${response.status}): ${body}`);
    }

    return response.json();
  }
}
