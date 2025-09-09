import { PublicLayoutWithoutSidebar } from "@/components/public/public-layout-without-sidebar";

export default function PrivacyPolicyPage() {
  return (
    <PublicLayoutWithoutSidebar>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">📜 Privacy Policy – EduHub</h1>
        <p className="mb-4">Last updated: September 09, 2025</p>

        <h2 className="text-2xl font-bold mt-6 mb-2">1. Information We Collect</h2>
        <p className="mb-4">
          When you use EduHub, we may collect the following information:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Account information:</strong> name, username, email address,
            password (encrypted).
          </li>
          <li>
            <strong>Uploaded content:</strong> documents, summaries, notes, and
            other educational resources you share on the platform.
          </li>
          <li>
            <strong>Usage data:</strong> interactions with the platform, such as
            uploads, downloads, or profile edits.
          </li>
          <li>
            <strong>Technical data:</strong> IP address, browser type, and cookies
            (to improve user experience).
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">2. How We Use Your Information</h2>
        <p className="mb-4">We use your personal data to:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Create and manage your EduHub account.</li>
          <li>
            Allow you to upload, share, and access educational resources.
          </li>
          <li>Ensure platform security and prevent misuse.</li>
          <li>Improve the quality of our services.</li>
          <li>
            Contact you for important updates related to your account or the
            platform.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">3. Sharing of Information</h2>
        <ul className="list-disc list-inside mb-4">
          <li>We do not sell or rent your personal information to third parties.</li>
          <li>Uploaded resources may be visible to other EduHub users.</li>
          <li>
            In rare cases, we may share data if required by law or to protect our
            rights and the safety of our users.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">4. Content Ownership & Responsibility</h2>
        <ul className="list-disc list-inside mb-4">
          <li>You remain the owner of the content you upload to EduHub.</li>
          <li>
            By uploading content, you grant EduHub a non-exclusive right to display
            and share it on the platform.
          </li>
          <li>
            You are solely responsible for ensuring that your content does not
            violate copyright or contain illegal/offensive material.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">5. Cookies and Tracking</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            EduHub may use cookies to store preferences, maintain sessions, and
            analyze usage.
          </li>
          <li>
            You can disable cookies in your browser settings, but this may affect
            certain features of the site.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">6. Data Security</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            We implement technical and organizational measures to protect your
            personal data from unauthorized access, loss, or misuse.
          </li>
          <li>Passwords are encrypted and never stored in plain text.</li>
          <li>Only authorized administrators have access to system data.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">7. Your Rights</h2>
        <p className="mb-4">As a user, you have the right to:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Access and update your personal information.</li>
          <li>Request deletion of your account and personal data.</li>
          <li>Control the visibility of the resources you upload.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">8. Children’s Privacy</h2>
        <p className="mb-4">
          EduHub is intended for students and academic use. We do not knowingly
          collect personal information from children under 13. If such data is
          found, it will be deleted immediately.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">9. Changes to this Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Any changes will be
          posted on this page with the updated date.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">10. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy or your data, you can
          contact us:
        </p>
        <p>
          📧 <a href="mailto:eduhubcenter1@gmail.com">eduhubcenter1@gmail.com</a>
        </p>
      </div>
    </PublicLayoutWithoutSidebar>
  );
}
