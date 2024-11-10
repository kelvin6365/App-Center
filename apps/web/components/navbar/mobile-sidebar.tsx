"use client";
import { Icons } from "@/components/icons";
import { DashboardNav } from "@/components/navbar/dashboard-nav";
import { MenuItems } from "@/components/navbar/menuItems";
import useUserProfileQuery from "@/queries/useUserProfileQuery";
import { filterMenuByRoles } from "@/utils/permissionChecking";
// import { DashboardNav } from "@/components/dashboard-nav";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@repo/ui/components/ui/sheet";
import { useState } from "react";
import useTeamSelectionStore from "../../stores/useTeamSelectionStore";
import TeamSwitcher from "./team-switcher";

// import { Playlist } from "../data/playlists";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const {
    userProfile,
    isLoading: isLoadingUserProfile,
    isError: isErrorUserProfile,
    refetch: refetchUserProfile,
  } = useUserProfileQuery();
  const { selectedTeam } = useTeamSelectionStore();
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Icons.menu />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="py-4 space-y-4">
            <div className="px-3 py-2">
              <TeamSwitcher className="w-full mb-4" />
              <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
                Overview
              </h2>
              <div className="space-y-1">
                <DashboardNav
                  items={
                    userProfile && !isErrorUserProfile && selectedTeam
                      ? filterMenuByRoles(
                          MenuItems,
                          userProfile,
                          selectedTeam.id,
                        )
                      : []
                  }
                  setOpen={setOpen}
                  isLoading={isLoadingUserProfile}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
