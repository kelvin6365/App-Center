"use client";
import { loginFormSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import API from "@/services/api";
import axios from "axios";
const RegisterForm = () => {
  const router = useRouter();
  const query = useSearchParams();
  const t = useTranslations("Auth");
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const {
    formState: { isSubmitting },
    setError,
  } = form;

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const {
        data: { data },
      } = await API.auth.register(
        values.username,
        values.password,
        values.username,
      );
      if (data) {
        const { error } =
          (await signIn("credentials", {
            username: values.username,
            password: values.password,
            redirect: false,
          })) ?? {};
        if (error) {
          //Go to Login Page
        } else {
          //Login success.
          //check have callbackUrl in query string
          const callbackUrl = query.get("callbackUrl");
          if (callbackUrl) {
            router.push(callbackUrl);
          } else {
            router.push("/onboarding");
          }
        }
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        switch (error.response?.data?.status?.code) {
          case 1012: {
            setError("username", {
              type: "manual",
              message: t("Email invalid or already taken"),
            });
            break;
          }
          default: {
            toast.error(error.response?.data?.status?.displayMessage);
            break;
          }
        }
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Username")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@mail.com"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Password")}</FormLabel>
                <FormControl>
                  <Input type={"password"} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {t("Sign Up")}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-background text-muted-foreground">
            {t("Or continue with")}
          </span>
        </div>
      </div>
      <Button variant={"outline"} disabled={isSubmitting}>
        GitHub
      </Button>
    </>
  );
};

export default RegisterForm;
