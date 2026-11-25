import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PaymentForm } from "@/components/PaymentForm";
import { PaymentLayout } from "@/components/payment-layout";
import { PAYMENTS } from "@/lib/icici";
import { PaymentTabs } from "@/components/student-pages";

export const metadata: Metadata = { title: "Online International Payment", description: "Secure online payment for G-TEC international centres, in US dollars." };

export default function InternationalPaymentPage() {
  return (
    <>
      <PageHero eyebrow="International payment" title="Secure and seamless international payment." intro="For international centres and partners, with amounts in US dollars.">
        <PaymentTabs current="/onlineinternationalpayment" />
      </PageHero>
      <PaymentLayout
        eyebrow="Pay in USD"
        title="International centre payments."
        intro="Enter your centre's details, choose the product and the amount in US dollars, then pay with an international card."
        currency="USD"
      >
        <PaymentForm kind="onlineinternationalpayment" currency={PAYMENTS.onlineinternationalpayment.currency} centreLabel="Centre / country" purposes={[...PAYMENTS.onlineinternationalpayment.purposes]} />
      </PaymentLayout>
    </>
  );
}
