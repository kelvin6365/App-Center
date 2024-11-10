"use client";
import StepOne from "@/app/[locale]/onboarding/_components/stepOne";
import { Form } from "@app-center/shadcn/ui";
import { cn } from "@app-center/shadcn/util";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { onboardingFormSchema } from "../../../../schema/onboarding";
import API from "../../../../services/api";
import { UserStatus } from "../../../../types/UserStatus";
import StepThree from "./_components/stepThree";
import StepTwo from "./_components/stepTwo";
const OnBoarding = () => {
  const router = useRouter();

  const { update, data: sessionData, status } = useSession();
  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      name: "",
      type: "",
      tenantName: "",
      step: 0,
    },
    mode: "onChange",
  });
  const { watch } = form;
  const step = watch("step");
  const onSubmit = async (values: z.infer<typeof onboardingFormSchema>) => {
    if (values.step !== 2) {
      return;
    }
    try {
      const {
        data: { data },
      } = await API.user.onBoarding({
        name: values.name,
        type: values.type,
        tenantName: values.tenantName,
      });
      if (data) {
        update();
        router.replace("/console");
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };
  useEffect(() => {
    if (
      status === "authenticated" &&
      sessionData?.user?.status !== UserStatus.Pending &&
      step === 0
    ) {
      router.replace("/console");
    }
  }, [sessionData, router, step, status]);

  //Check user already onboarded or not
  if (sessionData?.user?.status !== UserStatus.Pending) {
    return null;
  }
  return (
    <section className="flex">
      <div className="items-center w-full max-w-2xl gap-4 py-12 mx-auto my-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className={cn(step !== 0 ? "hidden" : "")}>
              <StepOne />
            </div>
            <div className={cn(step !== 1 ? "hidden" : "")}>
              <StepTwo />
            </div>
            <div className={cn(step !== 2 ? "hidden" : "")}>
              <StepThree />
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};
export default OnBoarding;
