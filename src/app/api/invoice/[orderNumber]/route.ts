import { getOrderByNumber } from "@/server/queries/orders";
import { getCurrentUser } from "@/lib/auth";
import { siteConfig } from "@/config/site";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

/** Renders a printable HTML invoice (browser → Save as PDF). */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ orderNumber: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { orderNumber } = await ctx.params;
  const isAdmin = ["ADMIN", "SUPER_ADMIN", "STAFF"].includes(user.role ?? "");
  const order = await getOrderByNumber(orderNumber, user.id, isAdmin);
  if (!order) return new Response("Not found", { status: 404 });

  const addr = order.shippingSnapshot as Record<string, string> | null;
  const rows = order.items
    .map(
      (i) => `<tr>
        <td>${i.name}<br><span class="muted">${[i.size, i.paperType, i.frameType].filter(Boolean).join(" · ")}</span></td>
        <td class="c">${i.quantity}</td>
        <td class="r">${inr(Number(i.unitPrice))}</td>
        <td class="r">${inr(Number(i.total))}</td>
      </tr>`,
    )
    .join("");

  const html = `<!doctype html><html><head><meta charset="utf-8">
  <title>Invoice ${order.orderNumber}</title>
  <style>
    *{box-sizing:border-box;font-family:ui-sans-serif,system-ui,Arial}
    body{max-width:720px;margin:40px auto;padding:0 24px;color:#111}
    h1{font-size:28px;margin:0}
    .muted{color:#777;font-size:12px}
    .row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px}
    table{width:100%;border-collapse:collapse;margin-top:16px}
    th,td{padding:10px;border-bottom:1px solid #eee;text-align:left;font-size:14px}
    th{font-size:11px;text-transform:uppercase;color:#777}
    .r{text-align:right}.c{text-align:center}
    .totals{margin-left:auto;width:260px;margin-top:16px}
    .totals div{display:flex;justify-content:space-between;padding:6px 10px;font-size:14px}
    .totals .grand{border-top:2px solid #111;font-weight:700;font-size:16px;margin-top:6px}
    .badge{display:inline-block;padding:2px 10px;border-radius:99px;background:#f2f2f2;font-size:12px}
    @media print{body{margin:0}}
  </style></head><body onload="window.print()">
    <div class="row">
      <div><h1>PULSE<span style="color:#c08a2d">.</span></h1><p class="muted">${siteConfig.contact.address}</p></div>
      <div style="text-align:right">
        <p class="muted">Invoice</p>
        <strong>${order.orderNumber}</strong>
        <p class="muted">${new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
        <span class="badge">${order.paymentMethod} · ${order.paymentStatus}</span>
      </div>
    </div>
    ${addr ? `<div class="row"><div><p class="muted">Bill to</p><strong>${addr.fullName}</strong><br>${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}<br>${addr.city}, ${addr.state} ${addr.pincode}<br>📞 ${addr.phone}</div></div>` : ""}
    <table>
      <thead><tr><th>Item</th><th class="c">Qty</th><th class="r">Price</th><th class="r">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="totals">
      <div><span>Subtotal</span><span>${inr(Number(order.subtotal))}</span></div>
      ${Number(order.discount) > 0 ? `<div><span>Discount</span><span>- ${inr(Number(order.discount))}</span></div>` : ""}
      <div><span>Shipping</span><span>${Number(order.shippingFee) === 0 ? "Free" : inr(Number(order.shippingFee))}</span></div>
      ${Number(order.giftWrapFee) > 0 ? `<div><span>Gift wrap</span><span>${inr(Number(order.giftWrapFee))}</span></div>` : ""}
      <div class="grand"><span>Total</span><span>${inr(Number(order.total))}</span></div>
    </div>
    <p class="muted" style="margin-top:40px;text-align:center">Thank you for shopping with ${siteConfig.name} · ${siteConfig.contact.email}</p>
  </body></html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
