"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { CreditCard, Banknote, Loader2, Lock, ShoppingBag } from "@/components/icons";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "./order-summary";
import { addressSchema, type AddressInput } from "@/lib/validations/checkout";
import { useCart } from "@/hooks/use-cart";
import { useCouponStore } from "@/hooks/use-coupon";
import { createOrder, confirmRazorpayPayment } from "@/server/actions/order";
import { loadRazorpay, openRazorpay } from "@/lib/load-razorpay";
import { siteConfig } from "@/config/site";
import { cn, formatPrice } from "@/lib/utils";

type PaymentMethod = "RAZORPAY" | "COD";

export function CheckoutClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, clear } = useCart();
  const { coupon, setCoupon } = useCouponStore();
  const [method, setMethod] = useState<PaymentMethod>("RAZORPAY");
  const [giftWrap, setGiftWrap] = useState(false);
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: session?.user?.name ?? "",
      country: "India",
      type: "HOME",
    },
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-28 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-secondary">
          <ShoppingBag className="size-8 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-2xl font-semibold">Nothing to check out</h1>
        <p className="text-sm text-muted-foreground">
          Add a poster to your bag before checking out.
        </p>
        <Button asChild>
          <Link href="/shop">Browse posters</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = async (address: AddressInput) => {
    setPlacing(true);
    try {
      const result = await createOrder({
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId ?? null,
          quantity: i.quantity,
        })),
        address,
        couponCode: coupon?.code ?? null,
        giftWrap,
        orderNotes: notes,
        paymentMethod: method,
      });

      if (!result.ok || !result.orderNumber) {
        toast.error(result.error ?? "Could not place order");
        return;
      }

      if (result.payment?.method === "COD") {
        clear();
        setCoupon(null);
        toast.success("Order placed!");
        router.push(`/order/${result.orderNumber}`);
        return;
      }

      // Razorpay online payment
      if (result.payment?.method === "RAZORPAY") {
        const loaded = await loadRazorpay();
        if (!loaded) {
          toast.error("Could not load payment gateway");
          return;
        }
        const orderNumber = result.orderNumber;
        openRazorpay({
          key: result.payment.keyId,
          amount: result.payment.amount * 100,
          currency: result.payment.currency,
          name: siteConfig.name,
          description: `Order ${orderNumber}`,
          order_id: result.payment.razorpayOrderId,
          prefill: {
            name: address.fullName,
            email: session?.user?.email ?? undefined,
            contact: address.phone,
          },
          theme: { color: "#111111" },
          handler: async (res) => {
            const verify = await confirmRazorpayPayment({
              orderNumber,
              razorpayOrderId: res.razorpay_order_id,
              razorpayPaymentId: res.razorpay_payment_id,
              razorpaySignature: res.razorpay_signature,
            });
            if (verify.ok) {
              clear();
              setCoupon(null);
              toast.success("Payment successful!");
              router.push(`/order/${orderNumber}`);
            } else {
              toast.error(verify.error ?? "Payment verification failed");
              router.push(`/order/${orderNumber}?status=failed`);
            }
          },
          modal: {
            ondismiss: () => toast.message("Payment cancelled"),
          },
        });
      }
    } catch {
      toast.error("Something went wrong placing your order");
    } finally {
      setPlacing(false);
    }
  };

  const codFee = method === "COD" ? siteConfig.shipping.codFee : 0;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-[1400px] px-4 py-10"
    >
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          {/* Shipping address */}
          <section className="space-y-4 rounded-xl border border-border p-6">
            <h2 className="font-semibold">Shipping Address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName?.message} className="sm:col-span-2">
                <Input {...register("fullName")} placeholder="Alex Morgan" />
              </Field>
              <Field label="Phone" error={errors.phone?.message}>
                <Input {...register("phone")} placeholder="9876543210" inputMode="numeric" />
              </Field>
              <Field label="Pincode" error={errors.pincode?.message}>
                <Input {...register("pincode")} placeholder="560038" inputMode="numeric" />
              </Field>
              <Field label="Address line 1" error={errors.line1?.message} className="sm:col-span-2">
                <Input {...register("line1")} placeholder="Flat / House no, Street" />
              </Field>
              <Field label="Address line 2 (optional)" error={errors.line2?.message} className="sm:col-span-2">
                <Input {...register("line2")} placeholder="Landmark, Area" />
              </Field>
              <Field label="City" error={errors.city?.message}>
                <Input {...register("city")} placeholder="Bengaluru" />
              </Field>
              <Field label="State" error={errors.state?.message}>
                <Input {...register("state")} placeholder="Karnataka" />
              </Field>
            </div>
          </section>

          {/* Order notes */}
          <section className="space-y-3 rounded-xl border border-border p-6">
            <h2 className="font-semibold">Order Notes (optional)</h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions for delivery or gift message…"
            />
          </section>

          {/* Payment method */}
          <section className="space-y-3 rounded-xl border border-border p-6">
            <h2 className="font-semibold">Payment Method</h2>
            <PaymentOption
              active={method === "RAZORPAY"}
              onClick={() => setMethod("RAZORPAY")}
              icon={<CreditCard className="size-5" />}
              title="Pay Online"
              subtitle="UPI · Cards · Netbanking · Wallets — secured by Razorpay"
            />
            <PaymentOption
              active={method === "COD"}
              onClick={() => setMethod("COD")}
              icon={<Banknote className="size-5" />}
              title="Cash on Delivery"
              subtitle={`Pay at your doorstep · +${formatPrice(siteConfig.shipping.codFee)} handling fee`}
            />
          </section>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-4 space-y-3 rounded-xl border border-border p-5">
            <h2 className="font-semibold">
              Your Bag ({items.length})
            </h2>
            <ul className="space-y-3">
              {items.map((i) => (
                <li key={`${i.productId}-${i.variantId}`} className="flex gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
                    <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {i.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="line-clamp-1 text-sm font-medium">{i.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[i.size, i.frameType].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    {formatPrice(i.unitPrice * i.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <OrderSummary
            subtotal={subtotal}
            giftWrap={giftWrap}
            onGiftWrapChange={setGiftWrap}
            showGiftWrap
            codFee={codFee}
          >
            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full"
              disabled={placing}
            >
              {placing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Lock className="size-4" />
              )}
              {method === "COD" ? "Place Order" : "Pay Now"}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              By placing your order you agree to our{" "}
              <Link href="/terms" className="underline">Terms</Link>.
            </p>
          </OrderSummary>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function PaymentOption({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors",
        active ? "border-primary bg-secondary/40" : "border-border hover:border-foreground/30",
      )}
    >
      <span className="grid size-10 place-items-center rounded-full bg-secondary">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <span
        className={cn(
          "grid size-5 place-items-center rounded-full border-2",
          active ? "border-primary" : "border-border",
        )}
      >
        {active && <span className="size-2.5 rounded-full bg-primary" />}
      </span>
    </button>
  );
}
