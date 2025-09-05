import { Metadata } from "next";
import { ContactSection } from "./Contactsection";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <ContactSection />
  );
}