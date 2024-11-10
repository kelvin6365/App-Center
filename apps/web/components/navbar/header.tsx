import { MobileSidebar } from "@/components/navbar/mobile-sidebar";
import { ModeToggle } from "@/components/navbar/mode-toggle";
import { UserNav } from "@/components/navbar/user-nav";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 border-b supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur">
      <nav className="flex items-center justify-between px-4 h-14">
        <div className="hidden lg:block">
          <Link
            href={"https://github.com/Kiranism/next-shadcn-dashboard-starter"}
            target="_blank"
          >
            <Image src="/images/logo.jpg" alt="logo" width={24} height={24} />
          </Link>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav />
          <ModeToggle />
        </div>
      </nav>
    </div>
  );
}
