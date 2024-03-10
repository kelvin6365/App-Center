'use client';
import { Icons } from '@/components/icons';
// import { DashboardNav } from "@/components/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from '@app-center/shadcn/ui';
import { useState } from 'react';

// import { Playlist } from "../data/playlists";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Icons.menu />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="py-4 space-y-4">
            <div className="px-3 py-2">
              <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
                Overview
              </h2>
              <div className="space-y-1">
                {/* <DashboardNav items={navItems} setOpen={setOpen} /> */}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
