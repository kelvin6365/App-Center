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
import AsyncSelect from "react-select/async";

type Props = {
  title: string;
  description: string;
  onClose: (reload: boolean) => void;
  open: boolean;
  app: App | null;
};

type UploadVersionFormInputs = {
  name: string;
  description: string;
  file: any;
  tags: string;
  installPassword: string;
  jiraIssues: string[];
};

const UploadVersionDialog = ({
  title,
  onClose,
  open,
  app,
  description,
}: Props) => {
  const t = useTranslations("Apps");

  const form = useForm<UploadVersionFormInputs>({
    defaultValues: {
      file: null,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    setValue,
  } = form;

  const onSubmit: SubmitHandler<UploadVersionFormInputs> = async (values) => {
    if (!app?.id) return;

    try {
      const apiKeyResult = await API.app.getAPIKey(app.id);
      const { data: apiKey } = apiKeyResult.data;

      const res = await API.app.uploadAppVersion(app.id, {
        name: values.name.trim(),
        description: values.description.trim(),
        file: values.file[0] ?? null,
        apiKey: apiKey,
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .join(","),
        installPassword: values.installPassword.trim(),
        jiraIssues: values.jiraIssues?.map((i) => i.trim()).join(",") ?? null,
      });

      if (res.data.status.code === 1000) {
        onClose(true);
        reset();
        toast.success(t("Update Successfully"));
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  const searchJiraIssues = async (inputValue: string) => {
    if (!app?.id || !inputValue) return [];

    try {
      const res = await API.app.searchJiraIssues(app.id, inputValue);
      return res.data.data.items;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const promiseOptions = async (inputValue: string) => {
    const issues = await searchJiraIssues(inputValue);
    return (
      issues?.map((i) => ({
        value: i.key,
        label: (
          <span className="flex items-center gap-2">
            <div
              className="min-w-fit w-fit"
              dangerouslySetInnerHTML={{ __html: i.keyHtml }}
            />
            <p className="truncate">{i.summaryText}</p>
          </span>
        ),
      })) ?? []
    );
  };

  useEffect(() => {
    reset();
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              id="upload-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  name="name"
                  control={control}
                  rules={{
                    required: t("Version Name is required"),
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Version Name")}</FormLabel>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="e.g., Version 1.0.0"
                      />
                      <FormDescription>
                        {t("eg")}: 'Version 1.0.0'
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="description"
                  control={control}
                  rules={{
                    required: t("Version Description is required"),
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Description")}</FormLabel>
                      <Textarea
                        {...field}
                        disabled={isSubmitting}
                        placeholder={t("Describe this version")}
                        className="min-h-[100px]"
                      />
                      <FormDescription>
                        {t("This is the description of the version")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  name="tags"
                  control={control}
                  rules={{
                    required: t("Tags is required"),
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Version Tags")}</FormLabel>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="e.g., stable,production"
                      />
                      <FormDescription>
                        {t("eg")}: 'Android,UAT,APK'
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="installPassword"
                  control={control}
                  rules={{
                    required: t("Install Password is required"),
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Install Password")}</FormLabel>
                      <Input
                        {...field}
                        type="password"
                        disabled={isSubmitting}
                        placeholder="Set install password"
                      />
                      <FormDescription>
                        {t("This is the password for the install page")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {app?.extra?.jiraCredential && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <FormField
                    name="jiraIssues"
                    control={control}
                    rules={{
                      required: false,
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Jira Issues Connect")}</FormLabel>
                        <AsyncSelect
                          ref={field.ref}
                          cacheOptions
                          defaultOptions
                          isMulti
                          loadOptions={promiseOptions}
                          onChange={(e) => {
                            setValue(
                              "jiraIssues",
                              e.map((i) => i.value),
                            );
                          }}
                          classNames={{
                            control: () => "!min-h-10",
                          }}
                          placeholder="Search Jira issues..."
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="space-y-4">
                <FormLabel>{t("Upload File")}</FormLabel>
                <FileUpload
                  {...register("file", {
                    required: t("File is required"),
                  })}
                  loading={isSubmitting}
                  errors={errors}
                  accept=".ipa,.apk,application/iphone-package-archive,application/vnd.android.package-archive"
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
            <Button type="submit" form="upload-form" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  {t("Uploading_dot")}
                </>
              ) : (
                t("Upload Version")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadVersionDialog;
