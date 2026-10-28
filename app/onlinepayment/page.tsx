import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { HandOff, LIVE, PaymentTabs } from "@/components/student-pages";

export const metadata: Metadata = { title: "Online Payment", description: "Secure and seamless online payment for G-TEC courses and programmes." };

export default function OnlinePaymentPage() {
  return (
    <>
      <PageHero eyebrow="Online payment" title="Secure and seamless online payment." intro="Pay for G-TEC courses, live classes and programmes online, in Indian rupees.">
        <PaymentTabs current="/onlinepayment" />
      </PageHero>
      <HandOff
        title="How to pay"
        steps={[
          "Choose your country, then enter your name, email and contact number.",
          "Select your state, district and G-TEC centre, and add your postal code and address.",
          "Pick the course or programme, set the quantity and check the amount in INR.",
          "Review the grand total and submit to complete payment on the secure gateway.",
        ]}
        details={[
          { label: "What you can pay for", items: ["Courses and certifications", "Live classes", "NSDC programmes", "G-Coderz programmes", "Soft skills workshops", "Centre registration"] },
          { label: "Have these ready", items: ["Country", "Name", "Email", "Contact number", "State and district", "Centre", "Postal code", "Address"] },
        ]}
        image={`${LIVE}/assets/img/payment/online-payment.webp`}
        href={`${LIVE}/onlinepayment`}
        cta="Continue to secure payment"
        note="Payments are processed on the secure G-TEC payment portal."
      />
    </>
  );
}
