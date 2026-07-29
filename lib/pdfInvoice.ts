import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

// Define PDF styles using standard @react-pdf/renderer StyleSheet
const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1F1B16",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#0D5C53",
    paddingBottom: 15,
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#0D5C53",
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 9,
    color: "#666666",
    marginTop: 3,
  },
  invoiceBadge: {
    textAlign: "right",
  },
  invoiceTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#1F1B16",
  },
  invoiceMeta: {
    fontSize: 9,
    color: "#555555",
    marginTop: 2,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: "48%",
    backgroundColor: "#FAF7F2",
    padding: 10,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#E5DEC9",
  },
  cardTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0D5C53",
    textTransform: "uppercase",
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  cardText: {
    fontSize: 9,
    color: "#333333",
    lineHeight: 1.3,
  },
  cardTextBold: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1F1B16",
  },
  table: {
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: "#E5DEC9",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0D5C53",
    color: "#FFFFFF",
    paddingVertical: 7,
    paddingHorizontal: 8,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5DEC9",
    paddingVertical: 7,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  colDesc: { width: "45%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "20%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },
  totalSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 25,
  },
  totalBox: {
    width: "40%",
    padding: 10,
    backgroundColor: "#FAF7F2",
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#E5DEC9",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#0D5C53",
    paddingTop: 6,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 35,
    right: 35,
    borderTopWidth: 0.5,
    borderTopColor: "#E5DEC9",
    paddingTop: 10,
    textAlign: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#777777",
  },
  authSeal: {
    marginTop: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: "#0D5C53",
    borderRadius: 4,
    textAlign: "center",
    backgroundColor: "#F4FAF9",
  },
  authSealText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0D5C53",
    textTransform: "uppercase",
  },
});

export interface InvoicePDFProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  gstin?: string;
  items: Array<{ name: string; color?: string; quantity: number; price: number }>;
  totalAmount: number;
  date?: string;
}

export function InvoicePDFDocument(props: InvoicePDFProps) {
  const {
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    address,
    city,
    state,
    postalCode,
    gstin,
    items,
    totalAmount,
    date,
  } = props;

  const invoiceDate = date || new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  const subtotal = Math.round(totalAmount / 1.18);
  const gst = totalAmount - subtotal;

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.brandTitle }, "MILLENNIUM"),
          React.createElement(Text, { style: styles.brandSubtitle }, "Handcrafted Solid Teak & Luxury Wood Furnishings"),
          React.createElement(Text, { style: styles.brandSubtitle }, "GSTIN: 21AAAFM9283K1Z9 | Bhubaneswar, Odisha")
        ),
        React.createElement(
          View,
          { style: styles.invoiceBadge },
          React.createElement(Text, { style: styles.invoiceTitle }, "TAX INVOICE"),
          React.createElement(Text, { style: styles.invoiceMeta }, `Invoice #: ${orderId}`),
          React.createElement(Text, { style: styles.invoiceMeta }, `Date: ${invoiceDate}`)
        )
      ),
      React.createElement(
        View,
        { style: styles.sectionRow },
        React.createElement(
          View,
          { style: styles.card },
          React.createElement(Text, { style: styles.cardTitle }, "Billed To (Customer)"),
          React.createElement(Text, { style: styles.cardTextBold }, customerName),
          React.createElement(Text, { style: styles.cardText }, customerEmail),
          customerPhone ? React.createElement(Text, { style: styles.cardText }, `Tel: ${customerPhone}`) : null,
          gstin ? React.createElement(Text, { style: styles.cardTextBold }, `GSTIN: ${gstin}`) : null
        ),
        React.createElement(
          View,
          { style: styles.card },
          React.createElement(Text, { style: styles.cardTitle }, "Delivery Address"),
          React.createElement(Text, { style: styles.cardText }, address || "Bhubaneswar HQ Pickup"),
          React.createElement(Text, { style: styles.cardText }, [city, state, postalCode].filter(Boolean).join(", ") || "Odisha, India"),
          React.createElement(Text, { style: styles.cardText }, "Dispatch Hub: Millennium Teak Factory, BBSR")
        )
      ),
      React.createElement(
        View,
        { style: styles.table },
        React.createElement(
          View,
          { style: styles.tableHeader },
          React.createElement(Text, { style: styles.colDesc }, "Item Description"),
          React.createElement(Text, { style: styles.colQty }, "Qty"),
          React.createElement(Text, { style: styles.colPrice }, "Unit Price (Rs)"),
          React.createElement(Text, { style: styles.colTotal }, "Total (Rs)")
        ),
        items && items.length > 0
          ? items.map((item, idx) =>
              React.createElement(
                View,
                { key: idx, style: styles.tableRow },
                React.createElement(
                  View,
                  { style: styles.colDesc },
                  React.createElement(Text, { style: { fontFamily: "Helvetica-Bold", fontSize: 9 } }, item.name),
                  item.color ? React.createElement(Text, { style: { fontSize: 8, color: "#666" } }, `Finish: ${item.color}`) : null
                ),
                React.createElement(Text, { style: styles.colQty }, item.quantity),
                React.createElement(Text, { style: styles.colPrice }, item.price.toLocaleString("en-IN")),
                React.createElement(Text, { style: styles.colTotal }, (item.price * item.quantity).toLocaleString("en-IN"))
              )
            )
          : React.createElement(
              View,
              { style: styles.tableRow },
              React.createElement(Text, { style: styles.colDesc }, "Custom Handcrafted Furniture Item"),
              React.createElement(Text, { style: styles.colQty }, "1"),
              React.createElement(Text, { style: styles.colPrice }, totalAmount.toLocaleString("en-IN")),
              React.createElement(Text, { style: styles.colTotal }, totalAmount.toLocaleString("en-IN"))
            )
      ),
      React.createElement(
        View,
        { style: styles.totalSection },
        React.createElement(
          View,
          { style: styles.totalBox },
          React.createElement(
            View,
            { style: styles.totalRow },
            React.createElement(Text, { style: { color: "#666" } }, "Subtotal:"),
            React.createElement(Text, { style: { fontFamily: "Helvetica-Bold" } }, `Rs.${subtotal.toLocaleString("en-IN")}`)
          ),
          React.createElement(
            View,
            { style: styles.totalRow },
            React.createElement(Text, { style: { color: "#666" } }, "GST (18% Included):"),
            React.createElement(Text, null, `Rs.${gst.toLocaleString("en-IN")}`)
          ),
          React.createElement(
            View,
            { style: styles.totalRow },
            React.createElement(Text, { style: { color: "#666" } }, "Shipping:"),
            React.createElement(Text, { style: { color: "#0D5C53", fontFamily: "Helvetica-Bold" } }, "FREE / Insured")
          ),
          React.createElement(
            View,
            { style: styles.grandTotalRow },
            React.createElement(Text, { style: { fontFamily: "Helvetica-Bold", fontSize: 11, color: "#0D5C53" } }, "Grand Total:"),
            React.createElement(Text, { style: { fontFamily: "Helvetica-Bold", fontSize: 11, color: "#0D5C53" } }, `Rs.${totalAmount.toLocaleString("en-IN")}`)
          )
        )
      ),
      React.createElement(
        View,
        { style: styles.authSeal },
        React.createElement(Text, { style: styles.authSealText }, "Officially Certified Digital Invoice - Millennium Teak Guarantee"),
        React.createElement(Text, { style: { fontSize: 7, color: "#666", marginTop: 2 } }, "This tax invoice is computer-generated and electronically verified. 10-Year Warranty Active.")
      ),
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(Text, { style: styles.footerText }, "Millennium Furniture | NH-16 Janpath, Master Canteen Square, Bhubaneswar, Odisha 751001"),
        React.createElement(Text, { style: styles.footerText }, "Support: +91 93343 09230 | Email: support@millenniumfurniture.in")
      )
    )
  );
}

export async function generateInvoicePDFBuffer(props: InvoicePDFProps): Promise<Buffer> {
  const element = InvoicePDFDocument(props);
  const pdfBuffer = await renderToBuffer(element as any);
  return pdfBuffer;
}
