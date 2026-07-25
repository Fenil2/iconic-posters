"use client";

import { useState } from "react";
import { Loader2 } from "@/components/icons";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/server/actions/account";

export function ProfileForm({
  initial,
}: {
  initial: { name: string; email: string; phone: string };
}) {
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile({ name, phone });
    setSaving(false);
    toast[res.ok ? "success" : "error"](
      res.ok ? "Profile updated" : res.error ?? "Could not update",
    );
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4 rounded-xl border border-border p-6">
      <div className="space-y-1.5">
        <Label>Full name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input value={initial.email} disabled className="opacity-60" />
        <p className="text-xs text-muted-foreground">Email can’t be changed.</p>
      </div>
      <div className="space-y-1.5">
        <Label>Phone</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="10-digit mobile"
          inputMode="numeric"
        />
      </div>
      <Button type="submit" disabled={saving}>
        {saving && <Loader2 className="size-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}
