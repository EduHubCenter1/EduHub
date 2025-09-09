import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className=" md:px-8 md:py-0">
      <div className="flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
          © 2025 EduHub. All rights reserved.
        </p>
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
          Powered by{" "}
          <Link href="/" className="font-bold text-primary">
            EduHub
          </Link>
          .
        </p>
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
