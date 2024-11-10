"use client";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { isRoleAllowedForPath } from "../../config/path-role-mapping";
import useUserProfileQuery from "../../queries/useUserProfileQuery";
import useTeamSelectionStore from "../../stores/useTeamSelectionStore";
import { RoleType } from "../../types/RoleType";
import Loading from "../loading";
const CustomScrollbars = tw(ScrollArea)`
  w-full
  h-full
`;
const CustomPageContent = tw.div`
  flex-1 space-y-4 p-4 md:p-8 pt-6
`;
const PageContent = ({ children }: PropsWithChildren) => {
  //initial state
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { userProfile } = useUserProfileQuery();

  const { selectedTeam } = useTeamSelectionStore();

  const userRole = userProfile?.roles.find(
    (r) => r.tenantId === selectedTeam?.id,
  );

  useEffect(() => {
    const checkAccess = async () => {
      const currentPath = pathname;

      if (!isRoleAllowedForPath(userRole?.type as RoleType, currentPath)) {
        // Redirect to a default page (e.g., dashboard) if the user doesn't have access
        console.log("=============[Redirect to dashboard]============");
        router.push("/console");
      }
      setIsReady(true);
    };
    if (userRole) {
      checkAccess();
    }
  }, [userRole, pathname, router, selectedTeam?.id, userProfile?.roles]);

  return (
    <CustomScrollbars>
      <CustomPageContent>
        {isReady ? children : <Loading fullScreen />}
      </CustomPageContent>
    </CustomScrollbars>
  );
};
export default PageContent;
