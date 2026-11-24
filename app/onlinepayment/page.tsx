import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PaymentForm } from "@/components/PaymentForm";
import { PAYMENTS } from "@/lib/icici";
import { ContactChips, LIVE, PaymentTabs, Split } from "@/components/student-pages";

export const metadata: Metadata = { title: "Online Payment", description: "Secure and seamless online payment for G-TEC courses and programmes." };

export default function OnlinePaymentPage() {
  return (
    <>
      <PageHero eyebrow="Online payment" title="Secure and seamless online payment." intro="Pay for G-TEC courses, live classes and programmes online, in Indian rupees.">
        <PaymentTabs current="/onlinepayment" />
      </PageHero>
      <Split
        eyebrow="Pay online"
        title="Pay your fees in a minute."
        intro={<p>Enter your details, choose what you're paying for and the amount in INR, then complete payment with card, UPI, net banking or wallet. You'll get a payment ID on success.</p>}
        aside={<><img src={`${LIVE}/assets/img/payment/online-payment.webp`} alt="" className="aspect-[16/10] w-full rounded-[28px] object-cover" /><ContactChips /></>}
      >
        <PaymentForm kind="onlinepayment" currency={PAYMENTS.onlinepayment.currency} purposes={[...PAYMENTS.onlinepayment.purposes]} />
      </Split>
    </>
  );
}
