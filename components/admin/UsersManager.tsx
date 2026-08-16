"use client";

import { useEffect, useState, type FormEvent } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { requireAuth, requireFunctions } from "@/lib/firebase/requireAuth";
import { listUsers } from "@/lib/data/users";
import type { Role, WithId, UserDoc } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const ROLES: { value: Role; label: string }[] = [
  { value: "superAdmin", label: "Super Admin" },
  { value: "contentEditor", label: "Content Editor" },
  { value: "leadsManager", label: "Leads Manager" },
];

interface InviteResult {
  resetLink: string;
}

export function UsersManager({ currentUid }: { currentUid: string }) {
  const [users, setUsers] = useState<WithId<UserDoc>[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("contentEditor");
  const [inviting, setInviting] = useState(false);
  const [lastInvite, setLastInvite] = useState<InviteResult | null>(null);
  const [savingUid, setSavingUid] = useState<string | null>(null);

  async function refresh() {
    try {
      setUsers(await listUsers());
    } catch {
      setError("Couldn't load users. Refresh the page.");
    }
  }

  // listUsers() needs a signed-in client with the superAdmin claim in place —
  // wait for Firebase Auth's persisted session to rehydrate before querying.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(requireAuth(), (user) => {
      if (user) void refresh();
    });
    return unsubscribe;
  }, []);

  async function handleInvite(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLastInvite(null);
    setInviting(true);
    try {
      const invite = httpsCallable<{ email: string; name: string; role: Role }, InviteResult>(
        requireFunctions(),
        "inviteAdminUser"
      );
      const result = await invite({ email: inviteEmail, name: inviteName, role: inviteRole });
      setLastInvite(result.data);
      setInviteEmail("");
      setInviteName("");
      setInviteRole("contentEditor");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invite failed.");
    } finally {
      setInviting(false);
    }
  }

  async function handleRoleChange(user: WithId<UserDoc>, role: Role) {
    await saveUser(user, { role, active: user.active });
  }

  async function handleActiveChange(user: WithId<UserDoc>, active: boolean) {
    await saveUser(user, { role: user.role, active });
  }

  async function saveUser(user: WithId<UserDoc>, next: { role: Role; active: boolean }) {
    setError(null);
    setSavingUid(user.id);
    try {
      const setUserRole = httpsCallable<{ uid: string; role: Role; active: boolean }, { ok: true }>(
        requireFunctions(),
        "setUserRole"
      );
      await setUserRole({ uid: user.id, role: next.role, active: next.active });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSavingUid(null);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleInvite} className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-4 sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="invite-name">Name</Label>
          <Input id="invite-name" required value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invite-email">Email</Label>
          <Input
            id="invite-email"
            type="email"
            required
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invite-role">Role</Label>
          <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as Role)}>
            <SelectTrigger id="invite-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={inviting}>
          {inviting ? "Inviting…" : "Invite user"}
        </Button>
      </form>

      {lastInvite && (
        <div className="rounded-md border border-border bg-muted p-3 text-sm text-foreground">
          Account created. Send this password-reset link to the new user directly (there&apos;s no
          automated invite email yet):
          <br />
          <code className="break-all">{lastInvite.resetLink}</code>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Active</th>
            </tr>
          </thead>
          <tbody>
            {users === null && (
              <tr>
                <td className="px-4 py-3 text-muted-foreground" colSpan={4}>
                  Loading…
                </td>
              </tr>
            )}
            {users?.map((user) => {
              const isSelf = user.id === currentUid;
              const saving = savingUid === user.id;
              return (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-4 py-2 text-foreground">{user.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-2">
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user, value as Role)}
                      disabled={isSelf || saving}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-2">
                    <Switch
                      checked={user.active}
                      disabled={isSelf || saving}
                      onCheckedChange={(checked) => handleActiveChange(user, checked)}
                      aria-label={`${user.active ? "Deactivate" : "Activate"} ${user.name}`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
