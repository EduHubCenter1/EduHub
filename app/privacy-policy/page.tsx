import { PublicLayoutWithoutSidebar } from "@/components/public/public-layout-without-sidebar";
import { Shield, FileText, Info, Users, Cookie, Lock, User, Baby, Pencil, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <PublicLayoutWithoutSidebar>
      <div className="bg-gray-50 min-h-screen">
        <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
            <p className="mt-4 text-lg text-gray-300">Your privacy is important to us. Here’s how we protect it.</p>
          </div>
        </header>

        <main className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-lg -mt-24">
              <p className="text-right text-sm text-gray-500 mb-10">Last updated: September 09, 2025</p>

              <div className="space-y-12">
                <Section icon={<Info size={24} className="text-black" />} title="1. Information We Collect">
                  <p className="text-gray-600 mb-4">
                    When you use EduHub, we may collect the following information:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard title="Account Information" items={["Name, username", "Email address", "Password (encrypted)"]} />
                    <InfoCard title="Content & Usage" items={["Uploaded documents", "Platform interactions", "Downloads, edits"]} />
                    <InfoCard title="Technical Data" items={["IP address", "Browser type", "Cookies for UX"]}/>
                  </div>
                </Section>

                <Section icon={<FileText size={24} className="text-black" />} title="2. How We Use Your Information">
                  <p className="text-gray-600 mb-4">We use your personal data to:</p>
                  <ul className="list-none space-y-3">
                    <ListItem>Create and manage your EduHub account.</ListItem>
                    <ListItem>Allow you to upload, share, and access educational resources.</ListItem>
                    <ListItem>Ensure platform security and prevent misuse.</ListItem>
                    <ListItem>Improve the quality of our services.</ListItem>
                    <ListItem>Contact you for important updates related to your account or the platform.</ListItem>
                  </ul>
                </Section>

                <Section icon={<Users size={24} className="text-black" />} title="3. Sharing of Information">
                   <ul className="list-none space-y-3">
                    <ListItem>We do not sell or rent your personal information to third parties.</ListItem>
                    <ListItem>Uploaded resources may be visible to other EduHub users.</ListItem>
                    <ListItem>In rare cases, we may share data if required by law or to protect our rights and the safety of our users.</ListItem>
                  </ul>
                </Section>

                <Section icon={<Cookie size={24} className="text-black" />} title="4. Content Ownership & Responsibility">
                  <ul className="list-none space-y-3">
                    <ListItem>You remain the owner of the content you upload to EduHub.</ListItem>
                    <ListItem>By uploading content, you grant EduHub a non-exclusive right to display and share it on the platform.</ListItem>
                    <ListItem>You are solely responsible for ensuring that your content does not violate copyright or contain illegal/offensive material.</ListItem>
                  </ul>
                </Section>

                <Section icon={<Lock size={24} className="text-black" />} title="6. Data Security">
                  <ul className="list-none space-y-3">
                    <ListItem>We implement technical and organizational measures to protect your personal data from unauthorized access, loss, or misuse.</ListItem>
                    <ListItem>Passwords are encrypted and never stored in plain text.</ListItem>
                    <ListItem>Only authorized administrators have access to system data.</ListItem>
                  </ul>
                </Section>
                
                <Section icon={<User size={24} className="text-black" />} title="7. Your Rights">
                  <p className="text-gray-600 mb-4">As a user, you have the right to:</p>
                  <ul className="list-none space-y-3">
                    <ListItem>Access and update your personal information.</ListItem>
                    <ListItem>Request deletion of your account and personal data.</ListItem>
                    <ListItem>Control the visibility of the resources you upload.</ListItem>
                  </ul>
                </Section>

                <Section icon={<Baby size={24} className="text-black" />} title="8. Children’s Privacy">
                  <p className="text-gray-600">
                    EduHub is intended for students and academic use. We do not knowingly collect personal information from children under 13. If such data is found, it will be deleted immediately.
                  </p>
                </Section>

                <Section icon={<Pencil size={24} className="text-black" />} title="9. Changes to this Privacy Policy">
                  <p className="text-gray-600">
                    We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated date.
                  </p>
                </Section>

                <Section icon={<Mail size={24} className="text-black" />} title="10. Contact Us">
                  <p className="text-gray-600 mb-4">
                    If you have any questions about this Privacy Policy or your data, you can contact us:
                  </p>
                  <p className="text-gray-800 font-medium">
                    <a href="mailto:contact@eduhubcenter.online" className="flex items-center gap-2 text-black hover:underline">
                      <Mail size={20} /> contact@eduhubcenter.online
                    </a>
                  </p>
                </Section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PublicLayoutWithoutSidebar>
  );
}

const Section = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <section>
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-gray-100 p-3 rounded-full">
        {icon}
      </div>
      <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
    </div>
    <div className="pl-16">
      {children}
    </div>
  </section>
);

const InfoCard = ({ title, items }: { title: string, items: string[] }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <h3 className="font-bold text-gray-700 mb-2">{title}</h3>
    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  </div>
);

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start">
    <span className="flex-shrink-0 mr-3 mt-1">•</span>
    <span>{children}</span>
  </li>
);