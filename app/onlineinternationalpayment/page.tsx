import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PaymentForm } from "@/components/PaymentForm";
import { PAYMENTS } from "@/lib/razorpay";
import { ContactChips, LIVE, PaymentTabs, Split } from "@/components/student-pages";

export const metadata: Metadata = { title: "Online International Payment", description: "Secure online payment for G-TEC international centres, in US dollars." };

export default function InternationalPaymentPage() {
  return (
    <>
      <PageHero eyebrow="International payment" title="Secure and seamless international payment." intro="For international centres and partners, with amounts in US dollars.">
        <PaymentTabs current="/onlineinternationalpayment" />
      </PageHero>
      <Split
        eyebrow="Pay in USD"
        title="International centre payments."
        intro={<p>Enter your centre's details, choose the product and the amount in US dollars, then pay with an international card.</p>}
        aside={<><img src={`${LIVE}/assets/img/payment/online-payment.webp`} alt="" className="aspect-[16/10] w-full rounded-[28px] object-cover" /><ContactChips /></>}
      >
        <PaymentForm kind="onlineinternationalpayment" currency={PAYMENTS.onlineinternationalpayment.currency} centreLabel="Centre / country" purposes={[...PAYMENTS.onlineinternationalpayment.purposes]} />
      </Split>
    </>
  );
}
