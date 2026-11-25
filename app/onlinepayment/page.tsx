import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PaymentForm } from "@/components/PaymentForm";
import { PaymentLayout } from "@/components/payment-layout";
import { PAYMENTS } from "@/lib/icici";
import { PaymentTabs } from "@/components/student-pages";

export const metadata: Metadata = { title: "Online Payment", description: "Secure and seamless online payment for G-TEC courses and programmes." };

export default function OnlinePaymentPage() {
  return (
    <>
      <PageHero eyebrow="Online payment" title="Secure and seamless online payment." intro="Pay for G-TEC courses, live classes and programmes online, in Indian rupees.">
        <PaymentTabs current="/onlinepayment" />
      </PageHero>
      <PaymentLayout
        eyebrow="Pay online"
        title="Pay your fees in a minute."
        intro="Enter your details, choose what you're paying for and the amount in INR, then complete payment with card, UPI, net banking or wallet. You'll get a payment ID on success."
        currency="INR"
      >
        <PaymentForm kind="onlinepayment" currency={PAYMENTS.onlinepayment.currency} purposes={[...PAYMENTS.onlinepayment.purposes]} />
      </PaymentLayout>
    </>
  );
}
