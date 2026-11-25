import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PaymentForm } from "@/components/PaymentForm";
import { PaymentLayout } from "@/components/payment-layout";
import { PAYMENTS } from "@/lib/icici";
import { PaymentTabs } from "@/components/student-pages";

export const metadata: Metadata = { title: "Payment for Centres", description: "Online fee payment for G-TEC centres and franchisees." };

export default function PaymentForCentresPage() {
  return (
    <>
      <PageHero eyebrow="Payment for centres" title="Secure and seamless centre payments." intro="Centres can pay subscription, royalty, examination and other fees online, in Indian rupees.">
        <PaymentTabs current="/paymentforcentres" />
      </PageHero>
      <PaymentLayout
        eyebrow="Centre fees"
        title="Pay centre fees online."
        intro="Enter your centre's details, pick the fee type and the total in INR, and add the particulars (invoice number, quantity, company name if paying as a company)."
        currency="INR"
      >
        <PaymentForm kind="paymentforcentres" currency={PAYMENTS.paymentforcentres.currency} purposes={[...PAYMENTS.paymentforcentres.purposes]} />
      </PaymentLayout>
    </>
  );
}
