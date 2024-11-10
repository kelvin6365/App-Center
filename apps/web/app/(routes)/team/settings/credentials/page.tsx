"use client";
import { useTranslations } from "next-intl";
import TeamCredentialTable from "../../../../../components/table/teamCredentialTable";

const CredentialsPage = () => {
  const t = useTranslations("Credentials");

  return (
    <div>
      <h3 className="text-lg font-medium">{t("Credentials")}</h3>
      <p className="text-sm text-muted-foreground">
        {t("This is how others will see your credentials on the site")}
      </p>
      <div>
        <TeamCredentialTable />
      </div>
    </div>
  );
};

export default CredentialsPage;
