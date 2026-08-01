import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "react-email";

const statusCopy: Record<string, { heading: string; body: string }> = {
  fulfilled: {
    heading: "Your order is being prepared.",
    body: "We're hand-finishing your Òkè Wúrà set.",
  },
  shipped: {
    heading: "Your order is on its way!",
    body: "Your Òkè Wúrà set has shipped.",
  },
  delivered: {
    heading: "Delivered!",
    body: "Your Òkè Wúrà set has arrived. Thank you for choosing House of Melony.",
  },
};

type OrderStatusUpdateEmailProps = {
  customerName: string;
  orderNumber: string;
  status: "fulfilled" | "shipped" | "delivered";
  trackingUrl: string;
};

export default function OrderStatusUpdateEmail({
  customerName,
  orderNumber,
  status,
  trackingUrl,
}: OrderStatusUpdateEmailProps) {
  const copy = statusCopy[status];

  return (
    <Html>
      <Head />
      <Preview>
        {copy.heading} — {orderNumber}
      </Preview>
      <Body
        style={{
          backgroundColor: "#0b0a08",
          fontFamily: "Georgia, serif",
          padding: "32px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#16130d",
            border: "1px solid rgba(198,149,47,0.3)",
            borderRadius: "8px",
            padding: "32px",
            maxWidth: "480px",
          }}
        >
          <Text
            style={{
              color: "#c6952f",
              fontSize: "12px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: "0 0 16px",
            }}
          >
            House of Melony
          </Text>
          <Heading style={{ color: "#efe3c2", fontSize: "22px", margin: "0 0 12px" }}>
            {copy.heading}
          </Heading>
          <Text style={{ color: "#efe3c2", fontSize: "15px", lineHeight: "24px" }}>
            Hi {customerName}, {copy.body}
          </Text>
          <Text style={{ color: "#b8a47d", fontSize: "13px", marginTop: "16px" }}>
            Order {orderNumber}
          </Text>

          <Button
            href={trackingUrl}
            style={{
              backgroundColor: "#c6952f",
              color: "#0b0a08",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 24px",
              borderRadius: "999px",
              marginTop: "24px",
            }}
          >
            Track your order
          </Button>

          <Text
            style={{
              color: "#b8a47d",
              fontSize: "13px",
              marginTop: "28px",
              fontStyle: "italic",
            }}
          >
            Òkè Wúrà. Worn once, remembered always.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
