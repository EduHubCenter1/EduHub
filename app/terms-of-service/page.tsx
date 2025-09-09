import { PublicLayoutWithoutSidebar } from "@/components/public/public-layout-without-sidebar";

export default function TermsOfServicePage() {
  return (
    <PublicLayoutWithoutSidebar>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="mb-4">Last updated: September 09, 2025</p>
        <p className="mb-4">
          Please read these terms and conditions carefully before using Our Service.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">Interpretation and Definitions</h2>
        <h3 className="text-xl font-bold mt-4 mb-2">Interpretation</h3>
        <p className="mb-4">
          The words of which the initial letter is capitalized have meanings defined
          under the following conditions. The following definitions shall have the
          same meaning regardless of whether they appear in singular or in plural.
        </p>
        <h3 className="text-xl font-bold mt-4 mb-2">Definitions</h3>
        <p className="mb-4">For the purposes of these Terms and Conditions:</p>
        <ul className="list-disc list-inside mb-4">
          <li>
            <p>
              <strong>Affiliate</strong> means an entity that controls, is
              controlled by or is under common control with a party, where
              "control" means ownership of 50% or more of the shares, equity
              interest or other securities entitled to vote for election of
              directors or other managing authority.
            </p>
          </li>
          <li>
            <p>
              <strong>Country</strong> refers to: Morocco
            </p>
          </li>
          <li>
            <p>
              <strong>Company</strong> (referred to as either "the Company", "We",
              "Us" or "Our" in this Agreement) refers to EduHub.
            </p>
          </li>
          <li>
            <p>
              <strong>Device</strong> means any device that can access the Service
              such as a computer, a cellphone or a digital tablet.
            </p>
          </li>
          <li>
            <p>
              <strong>Service</strong> refers to the Website.
            </p>
          </li>
          <li>
            <p>
              <strong>Terms and Conditions</strong> (also referred as "Terms")
              mean these Terms and Conditions that form the entire agreement
              between You and the Company regarding the use of the Service.
            </p>
          </li>
          <li>
            <p>
              <strong>Third-party Social Media Service</strong> means any services
              or content (including data, information, products or services)
              provided by a third-party that may be displayed, included or made
              available by the Service.
            </p>
          </li>
          <li>
            <p>
              <strong>Website</strong> refers to EduHub, accessible from
              [Your Website URL]
            </p>
          </li>
          <li>
            <p>
              <strong>You</strong> means the individual accessing or using the
              Service, or the company, or other legal entity on behalf of which
              such individual is accessing or using the Service, as applicable.
            </p>
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">Acknowledgment</h2>
        <p className="mb-4">
          These are the Terms and Conditions governing the use of this Service and
          the agreement that operates between You and the Company. These Terms and
          Conditions set out the rights and obligations of all users regarding the
          use of the Service.
        </p>
        <p className="mb-4">
          Your access to and use of the Service is conditioned on Your acceptance of
          and compliance with these Terms and Conditions. These Terms and
          Conditions apply to all visitors, users and others who access or use the
          Service.
        </p>
        <p className="mb-4">
          By accessing or using the Service You agree to be bound by these Terms and
          Conditions. If You disagree with any part of these Terms and Conditions
          then You may not access the Service.
        </p>
        <p className="mb-4">
          You represent that you are over the age of 18. The Company does not
          permit those under 18 to use the Service.
        </p>
        <p className="mb-4">
          Your access to and use of the Service is also conditioned on Your
          acceptance of and compliance with the Privacy Policy of the Company. Our
          Privacy Policy describes Our policies and procedures on the collection,
          use and disclosure of Your personal information when You use the
          Application or the Website and tells You about Your privacy rights and how
          the law protects You. Please read Our Privacy Policy carefully before
          using Our Service.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms and Conditions, You can
          contact us:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            <p>By email: [Your Email]</p>
          </li>
          <li>
            <p>By visiting this page on our website: [Your Contact Page URL]</p>
          </li>
        </ul>
      </div>
    </PublicLayoutWithoutSidebar>
  );
}