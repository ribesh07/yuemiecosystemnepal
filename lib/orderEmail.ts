import type { Order, OrderItem, User, Product, CustomerAddress, ShippingCity, Province, AddressZone } from "@prisma/client";

export type OrderWithRelations = Order & {
  user?: User | null;
  items?: (OrderItem & { product?: Pick<Product, "name" | "productCode"> | null })[];
};

type AddressSnapshot = CustomerAddress & {
  province?: Province | null;
  city?: ShippingCity | null;
  zone?: AddressZone | null;
};

const currency = (value: unknown) => {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return "Rs. 0";
  return `Rs. ${num.toLocaleString("en-IN")}`;
};

const baseHtml = (title: string, content: string) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "https://yuemi.com.np";
  const logoUrl = `https://yuemi.com.np/yuemi_logo_black.png`;

  return `
    <div style="font-family: Arial, sans-serif; color: #222; background: #f8f8f8; padding: 24px;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #eee;">
        <div style="padding: 20px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 12px;">
          <img src="${logoUrl}" alt="YuemiNepal" style="height: 28px;" />
        
        </div>
        <div style="padding: 20px; font-size: 14px; line-height: 1.6;">
          <h2 style="margin: 0; font-size: 20px; text-align: center;">${title}</h2>
          ${content}
        </div>
        <div style="padding: 16px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee;">
          YuemiNepal • Thank you for shopping with us.
        </div>
      </div>
    </div>
  `;
};

const buildItemsHtml = (order: OrderWithRelations) =>
  (order.items || [])
    .map((item) => {
      const name = item.product?.name || item.productCode;
      return `<tr>
        <td style="padding: 6px 0;">${name}</td>
        <td style="padding: 6px 0; text-align: center;">${item.quantity.toString()}</td>
        <td style="padding: 6px 0; text-align: right;">${currency(item.price)}</td>
      </tr>`;
    })
    .join("");

const buildTotalsHtml = (order: OrderWithRelations) => `
  <table style="width: 100%; margin-top: 12px; border-top: 1px solid #eee;">
    <tr><td style="padding: 6px 0;">Subtotal</td><td style="text-align: right;">${currency(order.subtotal)}</td></tr>
    <tr><td style="padding: 6px 0;">Shipping</td><td style="text-align: right;">${currency(order.shippingCost)}</td></tr>
    <tr><td style="padding: 6px 0;">Tax</td><td style="text-align: right;">${currency(order.tax)}</td></tr>
    <tr><td style="padding: 6px 0;">Discount</td><td style="text-align: right;">-${currency(order.discount)}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold;">Total</td><td style="text-align: right; font-weight: bold;">${currency(order.totalAmount)}</td></tr>
  </table>
`;

const buildAddressHtml = (address?: AddressSnapshot | null) => {
  if (!address) return "";
  const lines = [
    address.fullName,
    address.phone,
    address.address,
    address.landmark || "",
    [address.zone?.zoneName, address.city?.city, address.province?.name]
      .filter(Boolean)
      .join(", "),
  ].filter(Boolean);

  return `
    <div style="margin-top: 16px;">
      <strong>Shipping Address</strong>
      <div style="margin-top: 6px;">
        ${lines.map((line) => `<div>${line}</div>`).join("")}
      </div>
    </div>
  `;
};

export function buildOrderStatusEmail(order: OrderWithRelations) {
  const status = String(order.orderStatus || "processing").toUpperCase();
  const subject = `Your order ${order.orderNumber} is now ${status}`;

  const itemsHtml = buildItemsHtml(order);

  const html = baseHtml(
    "Order Update",
    `
      <p>Hello ${order.user?.fullName || "Customer"},</p>
      <p>Your order <strong>${order.orderNumber}</strong> status is now <strong>${status}</strong>.</p>
      <p>We will keep you updated as your order moves forward.</p>
      <p>Thank you for shopping with YuemiNepal.</p>
    `
  );

  const text = `Your order ${order.orderNumber} is now ${status}.`;

  return { subject, html, text };
}

export function buildOrderPlacedEmail(order: OrderWithRelations, address?: AddressSnapshot | null) {
  const subject = `Order Placed: ${order.orderNumber}`;
  const itemsHtml = buildItemsHtml(order);

  const html = baseHtml(
    "Order Confirmation",
    `
      <p>Hello ${order.user?.fullName || "Customer"},</p>
      <p>We have received your order <strong>${order.orderNumber}</strong>.</p>
      <table style="width: 100%; margin-top: 12px; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 6px 0; border-bottom: 1px solid #eee;">Item</th>
            <th style="text-align: center; padding: 6px 0; border-bottom: 1px solid #eee;">Qty</th>
            <th style="text-align: right; padding: 6px 0; border-bottom: 1px solid #eee;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      ${buildTotalsHtml(order)}
      ${buildAddressHtml(address)}
      <p>We will update you when your order ships.</p>
      <p><strong>Your invoice is attached with this email.</strong></p>
    `
  );

  const text = `We received your order ${order.orderNumber}.`;

  return { subject, html, text };
}

export function buildOrderPaymentEmail(order: OrderWithRelations) {
  const payment = String(order.paymentStatus || "unpaid").toUpperCase();
  const subject = `Payment status update for order ${order.orderNumber}`;
  const html = baseHtml(
    "Payment Update",
    `
      <p>Hello ${order.user?.fullName || "Customer"},</p>
      <p>Your payment status for order <strong>${order.orderNumber}</strong> is now <strong>${payment}</strong>.</p>
      ${buildTotalsHtml(order)}
    `
  );
  const text = `Payment status for order ${order.orderNumber} is now ${payment}.`;
  return { subject, html, text };
}

export function buildReturnStatusEmail(params: {
  orderNumber: string | number;
  customerName?: string | null;
  status: string;
  reason?: string | null;
  productName?: string | null;
}) {
  const subject = `Return update for order ${params.orderNumber}`;
  const html = baseHtml(
    "Return Update",
    `
      <p>Hello ${params.customerName || "Customer"},</p>
      <p>Your return request for order <strong>${params.orderNumber}</strong> is now <strong>${params.status.toUpperCase()}</strong>.</p>
      ${params.productName ? `<p>Product: ${params.productName}</p>` : ""}
      ${params.reason ? `<p>Reason: ${params.reason}</p>` : ""}
    `
  );
  const text = `Your return request for order ${params.orderNumber} is now ${params.status}.`;
  return { subject, html, text };
}
