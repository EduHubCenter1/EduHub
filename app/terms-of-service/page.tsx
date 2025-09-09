import { PublicLayoutWithoutSidebar } from "@/components/public/public-layout-without-sidebar";
import { FileText, Users, Shield, Mail, Handshake, FileCheck, FileX, UserCheck, BookOpen, UserPlus, ThumbsDown, Copyright, Book, Settings, AlertTriangle, Scale, MessageCircle } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <PublicLayoutWithoutSidebar>
      <div className="bg-gray-50 min-h-screen">
        <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight"> Terms of Service </h1>
          </div>
        </header>

        <main className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-lg -mt-24">
              <p className="text-right text-sm text-gray-500 mb-10">Last updated: September 2025</p>

              <div className="space-y-12">
                <Section icon={<Handshake size={24} className="text-black" />} title="1. Acceptance of Terms">
                  <p className="text-gray-600">
                    By accessing or using EduHub, you confirm that you agree to these Terms. If you do not agree, please do not use the platform.
                  </p>
                </Section>

                <Section icon={<UserPlus size={24} className="text-black" />} title="2. Accounts and Registration">
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>To use certain features, you must create an account with accurate and up-to-date information.</li>
                    <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                    <li>EduHub is not responsible for unauthorized access caused by your failure to protect your account.</li>
                  </ul>
                </Section>

                <Section icon={<ThumbsDown size={24} className="text-black" />} title="3. User Responsibilities">
                  <p className="text-gray-600 mb-4">By using EduHub, you agree that you will not:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Upload or share illegal, offensive, or harmful content.</li>
                    <li>Upload resources that infringe copyrights or intellectual property rights.</li>
                    <li>Misuse the platform (e.g., spam, hacking, or attempts to bypass security).</li>
                  </ul>
                </Section>

                <Section icon={<Copyright size={24} className="text-black" />} title="4. Content Ownership and License">
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>You remain the owner of the content you upload.</li>
                    <li>By uploading, you grant EduHub a non-exclusive, worldwide, royalty-free license to display, share, and distribute your content within the platform.</li>
                    <li>EduHub reserves the right to remove any content that violates these Terms.</li>
                  </ul>
                </Section>

                <Section icon={<Book size={24} className="text-black" />} title="5. Use of Platform">
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>EduHub is provided for educational purposes only.</li>
                    <li>Content is shared “as is”, and EduHub does not guarantee its accuracy or completeness.</li>
                    <li>Users must use the platform responsibly and respect other members.</li>
                  </ul>
                </Section>

                <Section icon={<Settings size={24} className="text-black" />} title="6. Moderation and Suspension">
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>EduHub administrators may remove or edit content at any time.</li>
                    <li>Accounts may be suspended or terminated for violations of these Terms.</li>
                  </ul>
                </Section>

                <Section icon={<AlertTriangle size={24} className="text-black" />} title="7. Disclaimer of Liability">
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>EduHub is not responsible for damages resulting from the use or inability to use the platform.</li>
                    <li>We are not liable for inaccuracies, errors, or illegal use of resources uploaded by users.</li>
                  </ul>
                </Section>

                <Section icon={<FileCheck size={24} className="text-black" />} title="8. Service Changes">
                  <p className="text-gray-600">
                    EduHub may modify, suspend, or discontinue parts of the service at any time without prior notice.
                  </p>
                </Section>

                <Section icon={<Scale size={24} className="text-black" />} title="9. Governing Law">
                  <p className="text-gray-600">
                    These Terms are governed by applicable laws in Morocco. Any disputes shall be resolved under Moroccan jurisdiction.
                  </p>
                </Section>

                <Section icon={<MessageCircle size={24} className="text-black" />} title="10. Contact">
                  <p className="text-gray-600 mb-4">For questions regarding these Terms, please contact us:</p>
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