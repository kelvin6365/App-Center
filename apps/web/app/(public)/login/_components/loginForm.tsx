"use client";
import { loginFormSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

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

import { getProviders, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const LoginForm = () => {
  const router = useRouter();
  const query = useSearchParams();
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const [renderProviders, setRenderProviders] = useState<JSX.Element[] | null>(
    null
  );
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    const { error } =
      (await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      })) ?? {};
    if (error) {
      //Login failed.
      console.error("Login failed", error);
      switch (error) {
        case "8006":
          //User already use another oauth provider.
          console.error("User already use another oauth provider.");
          toast.error(t("Status.LoginFailed"));
          break;

        default:
          toast.error(t("Status.LoginFailed"));
          break;
      }
    } else {
      //Login success.
      //check have callbackUrl in query string
      const callbackUrl = query.get("callbackUrl");
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push("/console");
      }
    }
  };
  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("github", {
        redirect: false,
        callbackUrl: query.get("callbackUrl") || "/console",
      });

      if (result?.error) {
        console.error("GitHub login failed:", result.error);
        toast.error(t("Status.LoginFailed"));
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Unexpected error during GitHub login:", error);
      toast.error(t("Status.UnexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderProvidersLoginButtons = async () => {
    const SplitElement = (
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
    );
    const render = [SplitElement];
    const providers = await getProviders();
    const githubProvider = Object.keys(providers ?? {}).find(
      (provider) => provider === "github"
    );
    if (githubProvider) {
      render.push(
        <Button
          variant={"outline"}
          disabled={isSubmitting || isLoading}
          onClick={async () => {
            await handleGithubLogin();
          }}
        >
          GitHub
        </Button>
      );
    }
    setRenderProviders(render.length > 1 ? render : null);
  };

  useEffect(() => {
    renderProvidersLoginButtons();
  }, []);

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
                    disabled={isSubmitting || isLoading}
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
                  <Input
                    type={"password"}
                    {...field}
                    disabled={isSubmitting || isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            {t("Login")}
          </Button>
        </form>
      </Form>

      {renderProviders}
    </>
  );
};

export default LoginForm;
