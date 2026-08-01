import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";

type OrderConfirmationEmailProps = {
  customerName: string;
  orderNumber: string;
  productName: string;
  variantLabel: string;
  qty: number;
  amountNaira: number;
  deliveryAddress: string;
  trackingUrl: string;
};

export default function OrderConfirmationEmail({
  customerName,
  orderNumber,
  productName,
  variantLabel,
  qty,
  amountNaira,
  deliveryAddress,
  trackingUrl,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Òkè Wúrà order is confirmed — {orderNumber}</Preview>
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
          <Heading style={{ color: "#efe3c2", fontSize: "24px", margin: "0 0 16px" }}>
            Thank you, {customerName}.
          </Heading>
          <Text style={{ color: "#efe3c2", fontSize: "15px", lineHeight: "24px" }}>
            Your order has been received and payment confirmed. Your Òkè Wúrà
            set is being prepared with the same care it took to make.
          </Text>

          <Section
            style={{
              marginTop: "24px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(198,149,47,0.3)",
            }}
          >
            <Text style={{ color: "#b8a47d", fontSize: "13px", margin: "0 0 4px" }}>
              Order number
            </Text>
            <Text style={{ color: "#efe3c2", fontSize: "15px", margin: "0 0 16px" }}>
              {orderNumber}
            </Text>

            <Text style={{ color: "#b8a47d", fontSize: "13px", margin: "0 0 4px" }}>
              Item
            </Text>
            <Text style={{ color: "#efe3c2", fontSize: "15px", margin: "0 0 16px" }}>
              {productName} — {variantLabel} × {qty}
            </Text>

            <Text style={{ color: "#b8a47d", fontSize: "13px", margin: "0 0 4px" }}>
              Amount paid
            </Text>
            <Text style={{ color: "#efe3c2", fontSize: "15px", margin: "0 0 16px" }}>
              ₦{amountNaira.toLocaleString("en-NG")}
            </Text>

            <Text style={{ color: "#b8a47d", fontSize: "13px", margin: "0 0 4px" }}>
              Delivering to
            </Text>
            <Text style={{ color: "#efe3c2", fontSize: "15px", margin: 0 }}>
              {deliveryAddress}
            </Text>
          </Section>

          <Button
            href={trackingUrl}
            style={{
              backgroundColor: "#c6952f",
              color: "#0b0a08",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 24px",
              borderRadius: "999px",
              marginTop: "28px",
            }}
          >
            Track your order
          </Button>

          <Text
            style={{
              color: "#b8a47d",
              fontSize: "13px",
              marginTop: "24px",
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
