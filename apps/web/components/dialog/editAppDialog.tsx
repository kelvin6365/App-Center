import FileUpload from "@/components/fileUpload/fileUpload";
import { Icons } from "@/components/icons";
import Loading from "@/components/loading";
import API from "@/services/api";
import { App } from "@/types/App";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
  title: string;
  description: string;
  onClose: (reload: boolean) => void;
  open: boolean;
  app: App | null;
};
type EditAppFormInputs = {
  name: string;
  description: string;
  icon: any;
  playStoreURL: string;
  appStoreURL: string;
  repoURL: string;
  jiraURL: string;
  confluenceURL: string;
};

const EditAppDialog = ({ title, onClose, open, app, description }: Props) => {
  const t = useTranslations("Apps");

  const form = useForm<EditAppFormInputs>({
    defaultValues: {
      icon: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = form;

  const onSubmit: SubmitHandler<EditAppFormInputs> = async (values) => {
    if (
      JSON.stringify({
        name: app?.name,
        description: app?.description,
        playStoreURL: app?.extra?.playStoreURL ?? "",
        appStoreURL: app?.extra?.appStoreURL ?? "",
        repoURL: app?.extra?.repoURL ?? "",
        jiraURL: app?.extra?.jiraURL ?? "",
        confluenceURL: app?.extra?.confluenceURL ?? "",
        icon: undefined,
      }) ===
      JSON.stringify({
        name: values.name,
        description: values.description,
        playStoreURL: values.playStoreURL,
        appStoreURL: values.appStoreURL,
        repoURL: values.repoURL,
        jiraURL: values.jiraURL,
        confluenceURL: values.confluenceURL,
        icon: values.icon[0] ?? undefined,
      })
    ) {
      toast.success(
        t("You have not changed anything in the form please submit again"),
      );
      return;
    }

    try {
      const res = await API.app.updateApp(app!.id, {
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

      if (res.data.status.code === 1000) {
        onClose(true);
        toast.success(t("Update Successfully"));
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  useEffect(() => {
    if (app) {
      reset({
        name: app.name,
        description: app.description,
        playStoreURL: app.extra?.playStoreURL,
        appStoreURL: app.extra?.appStoreURL,
        repoURL: app.extra?.repoURL,
        jiraURL: app.extra?.jiraURL,
        confluenceURL: app.extra?.confluenceURL,
        icon: undefined,
      });
    }
  }, [app, reset]);

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
        <DialogContent className="max-w-3xl !w-full max-h-[85vh] overflow-y-auto">
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
                <h3 className="text-lg font-semibold">
                  {t("Basic Information")}
                </h3>
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
                <h3 className="text-lg font-semibold">{t("Store Links")}</h3>
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
                <h3 className="text-lg font-semibold">
                  {t("Development Resources")}
                </h3>
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

              {/* App Icon Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t("App Icon")}</h3>
                {app?.iconFileURL && (
                  <div className="pointer-events-none relative mx-auto my-2 flex w-[180px]">
                    <img
                      src={app?.iconFileURL}
                      alt="preview"
                      className="mx-auto rounded-lg"
                    />
                  </div>
                )}
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
                  form.reset({
                    name: app?.name,
                    description: app?.description,
                    playStoreURL: app?.extra?.playStoreURL ?? "",
                    appStoreURL: app?.extra?.appStoreURL ?? "",
                    repoURL: app?.extra?.repoURL ?? "",
                    jiraURL: app?.extra?.jiraURL ?? "",
                    confluenceURL: app?.extra?.confluenceURL ?? "",
                    icon: undefined,
                  });
                }
              }}
              disabled={isSubmitting}
            >
              {t("Reset")}
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
                  {t("Saving_dot")}
                </>
              ) : (
                t("Save Changes")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditAppDialog;
