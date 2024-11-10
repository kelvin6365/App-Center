"use client";
import CustomBreadcrumb from "@/components/breadcrumb/breadcrumb";
import PageTitle from "@/components/content/pageTitle";
import { useTranslations } from "next-intl";
import React from "react";
import TeamMemberTable, {
  TableRef,
} from "../../../../components/table/teamUserTable";

const Members = () => {
  const t = useTranslations("Members");
  const tableRef = React.useRef<TableRef>(null);

  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: t("Team"),
            href: "/team",
          },
          {
            label: t("All Members"),
            href: "/team/members",
          },
        ]}
      />
      <PageTitle
        title={t("All Members")}
        description={t("All members can be found here")}
      />
      <div>
        <TeamMemberTable ref={tableRef} />
      </div>
    </div>
  );
};

export default Members;
