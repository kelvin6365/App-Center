"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import useAvailableTenantsQuery from "../../../../../../queries/useAvailableTenantsQuery";
import API from "../../../../../../services/api";
import useTeamSelectionStore from "../../../../../../stores/useTeamSelectionStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";

const profileFormSchema = z.object({
  teamName: z
    .string()
    .min(2, {
      message: "Team Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Team Name must not be longer than 30 characters.",
    }),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      }),
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const t = useTranslations("Settings");
  const { selectedTeam, setSelectedTeam } = useTeamSelectionStore();
  const { refetch } = useAvailableTenantsQuery();

  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    teamName: "",
    // urls: [
    //   { value: 'https://shadcn.com' },
    //   { value: 'http://twitter.com/shadcn' },
    // ],
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });
  const {
    formState: { isSubmitting },
  } = form;

  //   const { fields, append } = useFieldArray({
  //     name: 'urls',
  //     control: form.control,
  //   });

  const onSubmit = async (data: ProfileFormValues) => {
    console.log(data);
    if (!selectedTeam) {
      toast.error(t("Please select a team"));
      return;
    }
    try {
      await API.tenant.updateTenant({
        name: data.teamName,
      });
      toast.success(t("Updated successfully"));
      refetch().then((result) => {
        const tenants = result.data ?? [];
        const latestTenantInfo = tenants.find(
          (tenant) => tenant.id === selectedTeam.id,
        );
        if (!latestTenantInfo) {
          return;
        }
        setSelectedTeam({
          id: latestTenantInfo.id,
          name: latestTenantInfo.name,
        });
      });
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  useEffect(() => {
    if (selectedTeam) {
      form.reset({
        ...defaultValues,
        teamName: selectedTeam.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeam]);

  if (!selectedTeam) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="teamName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Team Name")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: '' })}
            disabled={isSubmitting}
          >
            Add URL
          </Button>
        </div> */}
        <Button type="submit" disabled={isSubmitting}>
          {t("Save")}
        </Button>
      </form>
    </Form>
  );
}
