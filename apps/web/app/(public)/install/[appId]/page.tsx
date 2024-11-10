"use client";

import { LockClosedIcon } from "@radix-ui/react-icons";
import axios from "axios";
import dayjs from "@repo/dayjs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiSolidDownload } from "react-icons/bi";
import { ImQrcode } from "react-icons/im";
import { z } from "zod";
import Custom404 from "../../../../components/404";
import QRCodeDialog from "../../../../components/dialog/qrCodeDialog";
import { ModeToggle } from "../../../../components/navbar/mode-toggle";
import API from "../../../../services/api";
import { App } from "../../../../types/App";
import { AppVersion } from "../../../../types/AppVersion";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Form, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";

const paramsSchema = z.object({
  appId: z.string().uuid(),
  versionId: z.string().uuid(),
});
type InstallAppFormInputs = {
  password: string;
};
const Page = ({ params }: { params: { appId: string } }) => {
  const t = useTranslations("Install Page");
  const searchParams = useSearchParams();
  const versionId = searchParams.get("versionId");
  const isAppIdValid = paramsSchema.safeParse({
    appId: params.appId,
    versionId,
  }).success;

  const [app, setApp] = useState<App | null>(null);
  const [version, setVersion] = useState<AppVersion | null>(null);
  const [openQRCode, setOpenQRCode] = useState({
    open: false,
    data: "",
  });

  const [wrongPasswordCount, setWrongPasswordCount] = useState(0);
  const form = useForm<InstallAppFormInputs>({
    defaultValues: {
      password: undefined,
    },
  });
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    control,
  } = form;

  const getApp = async () => {
    if (!params?.appId) {
      return;
    }
    try {
      const res = await API.app.publicInstallPageAppDetails(params.appId);
      const { data } = res.data;
      setApp(data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  const getVersion = async (password: string) => {
    if (wrongPasswordCount >= 5) {
      if (wrongPasswordCount === 5) {
        setTimeout(() => {
          setWrongPasswordCount(0);
        }, 30000);
      }
      setWrongPasswordCount(wrongPasswordCount + 1);
      return toast.error("Please try again after 30s!");
    }
    if (!params.appId || !versionId) {
      return;
    }
    try {
      const res = await API.app.publicInstallPageAppVersion(
        params.appId,
        versionId,
        password
      );
      const { data } = res.data;
      setVersion(data.version);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.status?.code === 1014) {
          setWrongPasswordCount(wrongPasswordCount + 1);
        }
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  const onSubmit: SubmitHandler<InstallAppFormInputs> = async (values) => {
    await getVersion(values.password);
  };

  useEffect(() => {
    //TODO: check appid and versionId is uuid
    if (isAppIdValid) {
      getApp();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isAppIdValid === false) {
    return (
      <div className="relative">
        <div className="top-0 left-0 right-0 flex justify-between px-4 border-b md:absolute">
          <div className="flex items-center gap-4 p-2 mx-auto mb-2 md:mx-0 md:p-4">
            <Image
              src="/images/logo.jpg"
              alt="logo"
              className="w-full h-full max-w-[32px] max-h-8 aspect-square my-auto"
              width={24}
              height={24}
            />
            <h1 className="text-2xl font-bold">{t("App Center")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center md:pt-8 md:mt-0 md:h-screen">
          <div className="py-4">
            <Custom404
              description={t("Invalid App ID or Version ID")}
              title={t("App can not be found")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="top-0 left-0 right-0 flex justify-between px-4 border-b md:absolute">
        <div className="flex items-center gap-4 p-2 mx-auto mb-2 md:mx-0 md:p-4">
          <Image
            src="/images/logo.jpg"
            alt="logo"
            className="w-full h-full max-w-[32px] max-h-8 aspect-square my-auto"
            width={24}
            height={24}
          />
          <h1 className="text-2xl font-bold">{t("App Center")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center md:pt-8 md:mt-0 md:h-screen">
        <Card className="w-full max-w-[24rem] m-auto overflow-hidden">
          <CardHeader className="grid px-4 py-8 m-0 text-center rounded-b-none bg-primary place-items-center">
            <div className="w-24 h-24 mb-4 text-white border rounded-lg border-white/10 bg-white/10 overflow-clip">
              <Image
                src={app?.iconFileURL ?? ""}
                className="overflow-clip"
                alt={app?.name ?? "App Icon"}
                width={94}
                height={94}
              />
            </div>
            <h3 className="text-2xl font-bold text-white">{app?.name}</h3>
            <h6 className="text-white">{app?.description}</h6>
          </CardHeader>
          <CardContent className="p-6">
            {version ? (
              <div>
                <div className="mb-4">
                  <p>
                    {t("Name")} : {version.name}
                  </p>
                  <p>
                    {t("Description")} : {version.description}
                  </p>
                  <p>
                    {t("Created at")} :{" "}
                    {dayjs(version.createdAt).format("YYYY-MM-DD HH:mm:ss a")}
                  </p>
                </div>
                <div className="flex flex-wrap space-x-2">
                  {version.tags.map((tag) => {
                    return (
                      <Badge key={tag.id} className={"normal-case"}>
                        {tag.name}
                      </Badge>
                    );
                  })}
                </div>
                <div className="flex justify-center p-2 mt-4 space-x-4 rounded-md bg-blue-gray-300/40">
                  <p
                    className="p-2 font-medium rounded-full hover:bg-white dark:hover:text-gray-700"
                    onClick={() => {
                      setOpenQRCode({
                        open: true,
                        data:
                          version.fileURL +
                          `?password=${getValues("password")}`,
                      });
                    }}
                  >
                    <ImQrcode className="w-5 h-5" />
                  </p>
                  <a
                    href={
                      version.fileURL + `?password=${getValues("password")}`
                    }
                    target="_blank"
                    className="p-2 font-medium rounded-full hover:bg-white dark:hover:text-gray-700"
                  >
                    <BiSolidDownload className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4 mt-2"
                >
                  <div className="mb-4">
                    <Controller
                      name="password"
                      control={control}
                      rules={{ required: t("Password is required") }}
                      render={({ field }) => {
                        return (
                          <>
                            <Input
                              {...field}
                              type="password"
                              placeholder={t("Password")}
                              disabled={isSubmitting}
                            />
                            <FormMessage />
                          </>
                        );
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={wrongPasswordCount === 6 || isSubmitting}
                  >
                    {t("Install Now")}
                  </Button>
                  <p className="flex items-center justify-center gap-2 mt-2 font-sans text-sm antialiased font-normal leading-normal text-gray-700 dark:text-white opacity-60">
                    <LockClosedIcon className="-mt-0.5 h-4 w-4" />{" "}
                    {t("App install are secure and encrypted")}
                  </p>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
        <QRCodeDialog
          title={t("QR Code")}
          open={openQRCode.open}
          onClose={() =>
            setOpenQRCode({
              open: false,
              data: "",
            })
          }
          qrCodeValue={openQRCode.data}
        />
      </div>
    </div>
  );
};

export default Page;
