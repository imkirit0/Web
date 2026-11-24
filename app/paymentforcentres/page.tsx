import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PaymentForm } from "@/components/PaymentForm";
import { PAYMENTS } from "@/lib/icici";
import { ContactChips, LIVE, PaymentTabs, Split } from "@/components/student-pages";

export const metadata: Metadata = { title: "Payment for Centres", description: "Online fee payment for G-TEC centres and franchisees." };

export default function PaymentForCentresPage() {
  return (
    <>
      <PageHero eyebrow="Payment for centres" title="Secure and seamless centre payments." intro="Centres can pay subscription, royalty, examination and other fees online, in Indian rupees.">
        <PaymentTabs current="/paymentforcentres" />
      </PageHero>
      <Split
        eyebrow="Centre fees"
        title="Pay centre fees online."
        intro={<p>Enter your centre's details, pick the fee type and the total in INR, and add the particulars (invoice number, quantity, company name if paying as a company).</p>}
        aside={<><img src={`${LIVE}/assets/img/payment/online-payment.webp`} alt="" className="aspect-[16/10] w-full rounded-[28px] object-cover" /><ContactChips /></>}
      >
        <PaymentForm kind="paymentforcentres" currency={PAYMENTS.paymentforcentres.currency} purposes={[...PAYMENTS.paymentforcentres.purposes]} />
      </Split>
    </>
  );
}
