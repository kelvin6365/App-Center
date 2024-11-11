import FileUpload from "@/components/fileUpload/fileUpload";
import Loading from "@/components/loading";
import API from "@/services/api";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";

import { cn } from "@repo/ui/lib/utils";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Icons } from "@/components/icons";

type Props = {
  title: string;
  description: string;
  onClose: (reload: boolean) => void;
  open: boolean;
};
type CreateAppFormInputs = {
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  playStoreURL: string;
  appStoreURL: string;
  repoURL: string;
  jiraURL: string;
  confluenceURL: string;
};

const CreateAppDialog = ({ title, onClose, open, description }: Props) => {
  const t = useTranslations("Apps");

  const form = useForm<CreateAppFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      icon: undefined,
      playStoreURL: "",
      appStoreURL: "",
      repoURL: "",
      jiraURL: "",
      confluenceURL: "",
      name: "",
      description: "",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = form;

  const onSubmit: SubmitHandler<CreateAppFormInputs> = async (values) => {
    console.log(values);
    try {
      const res = await API.app.createApp({
        name: values.name,
        description: values.description,
        icon: values.icon[0] ?? null,
        extra: {
          playStoreURL: values.playStoreURL,
          appStoreURL: values.appStoreURL,
          repoURL: values.repoURL,
          jiraURL: values.jiraURL,
          confluenceURL: values.confluenceURL,
        },
      });
      const { status } = res.data;
      if (status.code === 1000) {
        onClose(true);
        reset();
        toast.success(t("Created Successfully"));
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-[99999] bg-background/80 backdrop-blur-sm">
          <Loading fullScreen />
        </div>
      )}
      <Dialog
        open={open}
        onOpenChange={() => {
          if (!isSubmitting) {
            reset();
            onClose(false);
          }
        }}
      >
        <DialogContent
          className="max-w-3xl !w-full max-h-[85vh] overflow-y-auto"
          onEscapeKeyDown={(e) => {
            if (isSubmitting) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (isSubmitting) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="h-px bg-border" />
          <Form {...form}>
            <form
              id="edit-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 py-4"
            >
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid gap-4">
                  <FormField
                    name="name"
                    control={control}
                    rules={{
                      required: t("App Name is required"),
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("App Name")}</FormLabel>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          placeholder={t("Enter app name")}
                          className="w-full"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="description"
                    control={control}
                    rules={{
                      required: t("Description is required"),
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Description")}</FormLabel>
                        <Textarea
                          {...field}
                          disabled={isSubmitting}
                          placeholder={t("Describe your app")}
                          className="min-h-[100px]"
                        />
                        <FormDescription>
                          {t("This is the description of the app")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Store Links Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Store Links</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    name="playStoreURL"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Play Store URL")}</FormLabel>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          placeholder="https://play.google.com/store/apps/..."
                          className="w-full"
                        />
                        <FormDescription className="text-xs">
                          {t("eg")}:
                          https://play.google.com/store/apps/details?id=package_name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="appStoreURL"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("App Store URL")}</FormLabel>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          placeholder="https://apps.apple.com/..."
                          className="w-full"
                        />
                        <FormDescription className="text-xs">
                          {t("eg")}: https://apps.apple.com/country/app/name/id
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Development Links Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Development Resources</h3>
                <div className="grid gap-6">
                  <FormField
                    name="repoURL"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Git Repository URL")}</FormLabel>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          placeholder="https://gitlab.com/..."
                          className="w-full"
                        />
                        <FormDescription className="text-xs">
                          {t("eg")}: https://gitlab.com/username/project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      name="jiraURL"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Jira URL")}</FormLabel>
                          <Input
                            {...field}
                            disabled={isSubmitting}
                            placeholder="https://company.atlassian.net/..."
                            className="w-full"
                          />
                          <FormDescription className="text-xs">
                            {t("eg")}: https://company.atlassian.net/jira/...
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="confluenceURL"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Confluence URL")}</FormLabel>
                          <Input
                            {...field}
                            disabled={isSubmitting}
                            placeholder="https://company.atlassian.net/wiki/..."
                            className="w-full"
                          />
                          <FormDescription className="text-xs">
                            {t("eg")}:
                            https://company.atlassian.net/wiki/spaces/...
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* App Icon Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t("App Icon")}</h3>
                <FileUpload
                  {...register("icon", {})}
                  loading={isSubmitting}
                  errors={errors}
                />
              </div>
            </form>
          </Form>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (!isSubmitting) {
                  reset();
                  onClose(false);
                }
              }}
              disabled={isSubmitting}
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={() => {
                if (!isSubmitting) {
                  form.handleSubmit(onSubmit)();
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  {t("Creating_dot")}
                </>
              ) : (
                t("Create App")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateAppDialog;
