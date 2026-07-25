import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getUserAddresses } from "@/server/queries/account";
import { safe } from "@/server/queries/content";
import { AddressManager, type AddressData } from "@/components/account/address-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Addresses", robots: { index: false } };

export default async function AddressesPage() {
  const user = await getCurrentUser();
  const rows = await safe(() => getUserAddresses(user!.id), []);

  const addresses: AddressData[] = rows.map((a) => ({
    id: a.id,
    fullName: a.fullName,
    phone: a.phone,
    line1: a.line1,
    line2: a.line2 ?? "",
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    country: a.country,
    type: a.type,
    isDefault: a.isDefault,
  }));

  return <AddressManager addresses={addresses} />;
}
