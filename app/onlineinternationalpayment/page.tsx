import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { HandOff, LIVE, PaymentTabs } from "@/components/student-pages";

export const metadata: Metadata = { title: "Online International Payment", description: "Secure online payment for G-TEC international centres, in US dollars." };

export default function InternationalPaymentPage() {
  return (
    <>
      <PageHero eyebrow="International payment" title="Secure and seamless international payment." intro="For international centres and partners, with amounts in US dollars.">
        <PaymentTabs current="/onlineinternationalpayment" />
      </PageHero>
      <HandOff
        title="How to pay"
        steps={[
          "Choose your country, then enter your name, email and contact number.",
          "Select your state, district and centre, and add your postal code and address.",
          "Pick the product, set the quantity and check the amount in US dollars ($).",
          "Review the grand total and submit to complete payment on the secure gateway.",
        ]}
        details={[{ label: "What you can pay for", items: ["Royalty", "Global Campus Franchisee Fee"] }]}
        image={`${LIVE}/assets/img/payment/online-payment.webp`}
        href={`${LIVE}/onlineinternationalpayment`}
        cta="Continue to secure payment"
        note="Payments are processed on the secure G-TEC payment portal."
      />
    </>
  );
}
