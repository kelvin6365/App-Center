"use client";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import tw from "tailwind-styled-components";
import { isRoleAllowedForPath } from "../../config/path-role-mapping";
import useUserProfileQuery from "../../queries/useUserProfileQuery";
import useTeamSelectionStore from "../../stores/useTeamSelectionStore";
import { RoleType } from "../../types/RoleType";
const CustomScrollbars = tw(ScrollArea)`
  w-full
  h-full
`;
const CustomPageContent = tw.div`
  flex-1 space-y-4 p-4 md:p-8 pt-6
`;
const PageContent = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userProfile } = useUserProfileQuery();

  const { selectedTeam } = useTeamSelectionStore();
  useEffect(() => {
    const checkAccess = async () => {
      const currentPath = pathname;
      const userRole = userProfile?.roles.find(
        (r) => r.tenantId === selectedTeam?.id
      );
      if (!isRoleAllowedForPath(userRole?.type as RoleType, currentPath)) {
        // Redirect to a default page (e.g., dashboard) if the user doesn't have access
        router.push("/console");
      }
    };

    checkAccess();
  }, [pathname, router, selectedTeam?.id, userProfile?.roles]);

  return (
    <CustomScrollbars>
      <CustomPageContent>{children}</CustomPageContent>
    </CustomScrollbars>
  );
};
export default PageContent;
