"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Check, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { addressSchema, type AddressInput } from "@/lib/validations/checkout";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/server/actions/account";
import { cn } from "@/lib/utils";

export interface AddressData extends AddressInput {
  id: string;
  isDefault: boolean;
}

export function AddressManager({ addresses }: { addresses: AddressData[] }) {
  const [editing, setEditing] = useState<AddressData | null>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (a: AddressData) => {
    setEditing(a);
    setOpen(true);
  };

  const onDelete = (id: string) =>
    startTransition(async () => {
      const res = await deleteAddress(id);
      toast[res.ok ? "success" : "error"](res.ok ? "Address removed" : res.error!);
    });

  const onDefault = (id: string) =>
    startTransition(async () => {
      const res = await setDefaultAddress(id);
      if (res.ok) toast.success("Default address updated");
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Addresses</h1>
        <Button onClick={openNew}>
          <Plus className="size-4" /> Add address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <MapPin className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No saved addresses yet.</p>
          <Button variant="outline" onClick={openNew}>
            Add your first address
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div
              key={a.id}
              className={cn(
                "relative rounded-xl border p-5",
                a.isDefault ? "border-primary" : "border-border",
              )}
            >
              {a.isDefault && (
                <Badge className="absolute right-4 top-4">Default</Badge>
              )}
              <p className="font-medium">{a.fullName}</p>
              <Badge variant="muted" className="mt-1">{a.type}</Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.pincode}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">📞 {a.phone}</p>

              <div className="mt-4 flex gap-2">
                {!a.isDefault && (
                  <Button variant="ghost" size="sm" onClick={() => onDefault(a.id)} disabled={isPending}>
                    <Check className="size-4" /> Set default
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => openEdit(a)}>
                  <Pencil className="size-4" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => onDelete(a.id)}
                  disabled={isPending}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit address" : "Add address"}</DialogTitle>
          </DialogHeader>
          <AddressForm
            initial={editing}
            onDone={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddressForm({
  initial,
  onDone,
}: {
  initial: AddressData | null;
  onDone: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: initial ?? { country: "India", type: "HOME" },
  });

  const onSubmit = async (data: AddressInput) => {
    const res = initial
      ? await updateAddress(initial.id, data)
      : await addAddress(data);
    if (res.ok) {
      toast.success(initial ? "Address updated" : "Address added");
      onDone();
    } else {
      toast.error(res.error ?? "Could not save address");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 sm:grid-cols-2">
      <F label="Full name" error={errors.fullName?.message} full>
        <Input {...register("fullName")} />
      </F>
      <F label="Phone" error={errors.phone?.message}>
        <Input {...register("phone")} inputMode="numeric" />
      </F>
      <F label="Pincode" error={errors.pincode?.message}>
        <Input {...register("pincode")} inputMode="numeric" />
      </F>
      <F label="Address line 1" error={errors.line1?.message} full>
        <Input {...register("line1")} />
      </F>
      <F label="Address line 2" error={errors.line2?.message} full>
        <Input {...register("line2")} />
      </F>
      <F label="City" error={errors.city?.message}>
        <Input {...register("city")} />
      </F>
      <F label="State" error={errors.state?.message}>
        <Input {...register("state")} />
      </F>
      <F label="Type" full>
        <select
          {...register("type")}
          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="HOME">Home</option>
          <option value="WORK">Work</option>
          <option value="OTHER">Other</option>
        </select>
      </F>
      <div className="sm:col-span-2">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {initial ? "Save changes" : "Add address"}
        </Button>
      </div>
    </form>
  );
}

function F({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", full && "sm:col-span-2")}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
