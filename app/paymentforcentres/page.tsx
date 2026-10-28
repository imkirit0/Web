import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { HandOff, LIVE, PaymentTabs } from "@/components/student-pages";

export const metadata: Metadata = { title: "Payment for Centres", description: "Online fee payment for G-TEC centres and franchisees." };

export default function PaymentForCentresPage() {
  return (
    <>
      <PageHero eyebrow="Payment for centres" title="Secure and seamless centre payments." intro="Centres can pay subscription, royalty, examination and other fees online, in Indian rupees.">
        <PaymentTabs current="/paymentforcentres" />
      </PageHero>
      <HandOff
        title="How to pay"
        steps={[
          "Choose whether you are paying as an individual or a company.",
          "Enter your country, name, email, contact number, state, district, centre, postal code and address. Companies also add the company name and contact number.",
          "Add each fee: pick the fee type, the particulars, quantity and unit price.",
          "Check the grand total in INR and submit to complete payment on the secure gateway.",
        ]}
        details={[
          { label: "Fee types", items: ["Subscription fee", "G-TEC Universities fee", "GenSmart Academy fee", "Royalty", "Franchise registration", "Examination fee", "Course fee"] },
          { label: "Pay as", items: ["Individual", "Company"] },
        ]}
        image={`${LIVE}/assets/img/payment/online-payment.webp`}
        href={`${LIVE}/paymentforcentres`}
        cta="Continue to secure payment"
        note="Payments are processed on the secure G-TEC payment portal."
      />
    </>
  );
}
