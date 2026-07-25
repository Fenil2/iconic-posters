"use client";

import { useState } from "react";
import { Loader2 } from "@/components/icons";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { saveSetting } from "@/server/actions/settings";

export function SettingsForm({
  announcement,
  store,
}: {
  announcement: { text: string; enabled: boolean };
  store: { codEnabled: boolean; giftWrapFee: number };
}) {
  const [text, setText] = useState(announcement.text);
  const [enabled, setEnabled] = useState(announcement.enabled);
  const [cod, setCod] = useState(store.codEnabled);
  const [giftFee, setGiftFee] = useState(store.giftWrapFee);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const r1 = await saveSetting("announcement", { text, enabled });
    const r2 = await saveSetting("store", { codEnabled: cod, giftWrapFee: Number(giftFee) });
    setSaving(false);
    toast[r1.ok && r2.ok ? "success" : "error"](r1.ok && r2.ok ? "Settings saved" : "Failed to save");
  };

  return (
    <div className="max-w-xl space-y-6">
      <div className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold">Announcement bar</h3>
        <label className="flex items-center justify-between text-sm">
          Show announcement bar
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </label>
        <div className="space-y-1.5">
          <Label>Message</Label>
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold">Store</h3>
        <label className="flex items-center justify-between text-sm">
          Enable Cash on Delivery
          <Switch checked={cod} onCheckedChange={setCod} />
        </label>
        <div className="space-y-1.5">
          <Label>Gift wrap fee (₹)</Label>
          <Input type="number" value={giftFee} onChange={(e) => setGiftFee(Number(e.target.value))} />
        </div>
      </div>

      <Button onClick={save} disabled={saving}>
        {saving && <Loader2 className="size-4 animate-spin" />} Save settings
      </Button>
    </div>
  );
}
