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
import { Input } from "@repo/ui/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import API from "../../../../../services/api";
import useUserProfileQuery from "../../../../../queries/useUserProfileQuery";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const t = useTranslations("Account");
  const {
    userProfile,
    isLoading: isLoadingUserProfile,
    isError: isErrorUserProfile,
    refetch: refetchUserProfile,
  } = useUserProfileQuery();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await API.user.updateProfile(data);
      toast.success(t("Updated successfully"));
      refetchUserProfile();
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  useEffect(() => {
    // This can come from your database or API.
    const defaultValues: Partial<ProfileFormValues> = {
      name: userProfile?.profile.name ?? "",
    };

    if (userProfile) {
      form.reset({
        ...defaultValues,
        name: userProfile?.profile.name ?? "",
      });
    }
  }, [userProfile, form]);

  if (!userProfile || isErrorUserProfile || isLoadingUserProfile) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Name")}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {}
          {t("Save")}
        </Button>
      </form>
    </Form>
  );
}
