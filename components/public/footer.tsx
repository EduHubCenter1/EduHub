import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-[0_-4px_26px_5px_rgba(99,102,241,0.5)]">
      <div className="flex  items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="flex items-center justify-center gap-2 text-balance text-center text-sm leading-loose text-muted-foreground">
          Powered by{" "}
          <Link href="/" className="flex items-center justify-center align-baseline space-x-2">
            <Image src="/sidebar.png" alt="EduHub Logo" width={130} height={130} />
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
