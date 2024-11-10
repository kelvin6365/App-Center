"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";

import { cn } from "@repo/ui/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import CustomBreadcrumb from "../../../../../components/breadcrumb/breadcrumb";
import PageTitle from "../../../../../components/content/pageTitle";
import useAvailablePlansQuery from "../../../../../queries/useAvailablePlansQuery";
import useUserProfileQuery from "../../../../../queries/useUserProfileQuery";
const BillingPage = () => {
  const {
    data: { items: plans },
  } = useAvailablePlansQuery();
  const {
    userProfile,
    isLoading: isLoadingUserProfile,
    isError: isErrorUserProfile,
    refetch: refetchUserProfile,
  } = useUserProfileQuery();
  const subscriptions = userProfile?.subscriptions ?? [];
  const locale = useLocale();
  const t = useTranslations("Account");
  const form = useForm({
    defaultValues: {
      type: subscriptions.length > 0 ? subscriptions[0].planId : "",
    },
  });
  const onSubmit = () => {
    // Submit form data
  };

  useEffect(() => {
    if (subscriptions.length > 0) {
      form.setValue("type", subscriptions[0].planId);
    }
  }, [subscriptions]);

  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: t("Account"),
            href: "/account",
          },
          {
            label: t("Billing"),
            href: "/account/Billing",
          },
        ]}
      />
      <PageTitle title={t("Billing")} description={t("Plans and Billing")} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t("Available Plans")}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="space-y-4 lg:max-w-2xl">
                      {/* Current Plan */}
                      {plans.map((plan) => (
                        <FormItem
                          key={plan.id}
                          className={cn(
                            "flex items-center p-4 space-x-3 space-y-0 border rounded-md shadow bg-secondary",
                            field.value === plan.id ? "border-primary" : ""
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem value={plan.id} />
                          </FormControl>
                          <FormLabel className="flex-col font-normal">
                            <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                              {plan.name[locale]}
                            </p>
                            <p className="text-xs leading-none text-gray-500 dark:text-gray-300">
                              {plan.description[locale]}
                            </p>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={
              subscriptions.some((s) => s.planId === form.watch("type")) ||
              isLoadingUserProfile ||
              isErrorUserProfile
            }
            type="submit"
          >
            {subscriptions.length > 0 ? t("Update") : t("Submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BillingPage;
