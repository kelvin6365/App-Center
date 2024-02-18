// import { DashboardNav } from "@/components/dashboard-nav";
// import { navItems } from "@/constants/data";
import { cn } from '@app-center/shadcn/util';

export default function Sidebar() {
  return (
    <nav
      className={cn(
        `relative hidden h-screen border-r pt-16 lg:block w-72 transition-all`
      )}
    >
      <div className="py-4 space-y-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="px-4 mb-2 text-xl font-semibold tracking-tight">
              Overview
            </h2>
            {/* <DashboardNav items={navItems} /> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
