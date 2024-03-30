// import { DashboardNav } from "@/components/dashboard-nav";
// import { navItems } from "@/constants/data";
import { DashboardNav } from '@/components/navbar/dashboard-nav';
import { MenuItems } from '@/components/navbar/menuItems';
import TeamSwitcher from '@/components/navbar/team-switcher';
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
          <TeamSwitcher className="w-full mb-4" />
          <div className="space-y-1">
            <h2 className="px-4 mb-2 text-xl font-semibold tracking-tight">
              Overview
            </h2>
            <DashboardNav items={MenuItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
