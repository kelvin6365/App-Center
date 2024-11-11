"use client";

import PageTitle from "@/components/content/pageTitle";
import DashboardCard from "@/components/card/dashboard-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { useTranslations } from "next-intl";
import { Users, Activity } from "lucide-react";

const ConsolePage = () => {
  const t = useTranslations("Dashboard");
  return (
    <div>
      <PageTitle title={t("Dashboard")} description="" />
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Active Users"
            value={0}
            description="+0 since last hour"
            icon={Users}
          />
          <DashboardCard
            title="Total Users"
            value={"+0"}
            description="+0 from last month"
            icon={Users}
          />
          <DashboardCard title="-" value="-" description="-" icon={Activity} />
          <DashboardCard title="-" value="-" description="-" icon={Activity} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">{/* <Overview /> */}</CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>-</CardTitle>
              <CardDescription>-</CardDescription>
            </CardHeader>
            <CardContent>{/* <RecentSales /> */}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConsolePage;
