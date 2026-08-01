import { Body, Container, Head, Heading, Html, Preview, Text } from "react-email";

type OrderNotificationEmailProps = {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  productName: string;
  variantLabel: string;
  qty: number;
  amountNaira: number;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  notes?: string | null;
};

export default function OrderNotificationEmail({
  orderNumber,
  customerName,
  email,
  phone,
  productName,
  variantLabel,
  qty,
  amountNaira,
  deliveryAddress,
  deliveryCity,
  deliveryState,
  notes,
}: OrderNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New paid order — {orderNumber}</Preview>
      <Body style={{ backgroundColor: "#0b0a08", fontFamily: "monospace", padding: "24px 0" }}>
        <Container
          style={{
            backgroundColor: "#16130d",
            border: "1px solid rgba(198,149,47,0.3)",
            borderRadius: "8px",
            padding: "24px",
            maxWidth: "480px",
          }}
        >
          <Heading style={{ color: "#c6952f", fontSize: "18px", margin: "0 0 16px" }}>
            New paid order: {orderNumber}
          </Heading>
          <Text style={{ color: "#efe3c2", fontSize: "14px", lineHeight: "22px" }}>
            {productName} — {variantLabel} × {qty}
            <br />
            Amount: ₦{amountNaira.toLocaleString("en-NG")}
            <br />
            <br />
            Customer: {customerName}
            <br />
            Email: {email}
            <br />
            Phone: {phone}
            <br />
            <br />
            Deliver to: {deliveryAddress}, {deliveryCity}, {deliveryState}
            {notes ? (
              <>
                <br />
                <br />
                Notes: {notes}
              </>
            ) : null}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
