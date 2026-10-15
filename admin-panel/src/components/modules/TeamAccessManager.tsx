"use client";

import { useState } from "react";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Mail,
  CheckCircle2,
  Lock,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
} from "lucide-react";
import { AdminSelect } from "@/components/admin/AdminSelect";
import type { Role } from "@/lib/types";

export interface TeamMember {
  uid: string;
  name: string;
  email: string;
  role: Role;
  disabled: boolean;
  lastActive: string;
  joinedDate: string;
}

const DEFAULT_TEAM: TeamMember[] = [
  {
    uid: "usr-1",
    name: "Vikramjit Singh",
    email: "superfinish@infini.co.in",
    role: "superAdmin",
    disabled: false,
    lastActive: "Active Now",
    joinedDate: "Jan 2025",
  },
  {
    uid: "usr-2",
    name: "Rajesh Malhotra",
    email: "r.malhotra@infini.co.in",
    role: "contentEditor",
    disabled: false,
    lastActive: "2 hours ago",
    joinedDate: "Mar 2025",
  },
  {
    uid: "usr-3",
    name: "Pooja Verma",
    email: "p.verma@infini.co.in",
    role: "leadsManager",
    disabled: false,
    lastActive: "Yesterday",
    joinedDate: "Apr 2025",
  },
];

export function TeamAccessManager({ currentUid }: { currentUid?: string }) {
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("contentEditor");

  const filteredTeam = team.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleDisabled = (uid: string) => {
    setTeam((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, disabled: !u.disabled } : u))
    );
  };

  const handleRoleChange = (uid: string, newRole: Role) => {
    setTeam((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
    );
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    const newMember: TeamMember = {
      uid: `usr-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      disabled: false,
      lastActive: "Invited",
      joinedDate: "Today",
    };

    setTeam((prev) => [...prev, newMember]);
    setInviteName("");
    setInviteEmail("");
    setIsInviteOpen(false);
  };

  const roleLabels: Record<Role, string> = {
    superAdmin: "Super Admin",
    contentEditor: "Content Editor",
    leadsManager: "Leads Manager",
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <span>Administration</span>
            <span>/</span>
            <span className="text-foreground">Access Control & Staff</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Team & Role-Based Permissions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage authenticated users, define operational roles (Content Editor, Leads Manager, Super Admin), and review audit logs.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90"
        >
          <UserPlus className="size-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Total Team
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Users className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {team.length}
            </span>
            <span className="text-xs text-muted-foreground">active accounts</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Super Admins
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <ShieldCheck className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {team.filter((u) => u.role === "superAdmin").length}
            </span>
            <span className="text-xs text-muted-foreground">full privilege</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Content Editors
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Edit2 className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {team.filter((u) => u.role === "contentEditor").length}
            </span>
            <span className="text-xs text-muted-foreground">CMS publication</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Leads Managers
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Mail className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {team.filter((u) => u.role === "leadsManager").length}
            </span>
            <span className="text-xs text-muted-foreground">CAD & inquiry triage</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/70 bg-card/60 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none backdrop-blur-sm"
          />
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          Showing {filteredTeam.length} of {team.length} accounts
        </span>
      </div>

      {/* Team Member Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeam.map((member) => (
          <div
            key={member.uid}
            className={`group relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-md transition-all duration-200 ${
              !member.disabled
                ? "border-border/80 bg-card/40 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
                : "border-border/40 bg-card/20 opacity-60"
            }`}
          >
            <div>
              {/* Card top */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                    member.role === "superAdmin"
                      ? "bg-accent/15 text-accent border-accent/30"
                      : member.role === "contentEditor"
                      ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                      : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                  }`}
                >
                  {roleLabels[member.role]}
                </span>

                <span
                  className={`flex items-center gap-1 text-[10px] font-mono ${
                    !member.disabled ? "text-emerald-400" : "text-destructive"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      !member.disabled ? "bg-emerald-400" : "bg-destructive"
                    }`}
                  />
                  {!member.disabled ? "Active" : "Disabled"}
                </span>
              </div>

              {/* Name & Email */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent font-mono text-sm font-bold">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">{member.name}</h2>
                  <div className="text-xs text-muted-foreground font-mono">{member.email}</div>
                </div>
              </div>

              {/* Activity Info */}
              <div className="mt-4 rounded-xl border border-border/50 bg-background/40 p-2.5 text-[11px] font-mono text-muted-foreground flex justify-between">
                <span>Last active: {member.lastActive}</span>
                <span>Joined: {member.joinedDate}</span>
              </div>
            </div>

            {/* Role dropdown and toggle */}
            <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between gap-2">
              <div className="w-36">
                <AdminSelect
                  value={member.role}
                  onChange={(val) => handleRoleChange(member.uid, val as Role)}
                  options={[
                    { value: "superAdmin", label: "Super Admin" },
                    { value: "contentEditor", label: "Content Editor" },
                    { value: "leadsManager", label: "Leads Manager" },
                  ]}
                  variant="pill"
                  placement="top"
                  className="py-1 px-2.5 text-[11px]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleToggleDisabled(member.uid)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  member.disabled
                    ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                }`}
              >
                {member.disabled ? "Enable" : "Disable"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-hidden">
          <div className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl border border-border/80 bg-background shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0 bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <UserPlus className="size-4" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Invite Team Member
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-card hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Malhotra"
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="name@infini.co.in"
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Role Assignment
                  </label>
                  <AdminSelect
                    value={inviteRole}
                    onChange={(val) => setInviteRole(val as Role)}
                    options={[
                      { value: "contentEditor", label: "Content Editor (Banners, blogs, case studies)" },
                      { value: "leadsManager", label: "Leads Manager (Inquiries and CAD downloads)" },
                      { value: "superAdmin", label: "Super Admin (All modules and company settings)" },
                    ]}
                  />
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border/60 shrink-0 bg-background/95 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90"
                >
                  <UserPlus className="size-3.5" />
                  <span>Send Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
