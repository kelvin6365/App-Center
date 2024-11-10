import FileUpload from "@/components/fileUpload/fileUpload";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
type EditAppFormInputs = {
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const form = useForm<EditAppFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
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

  const onSubmit: SubmitHandler<EditAppFormInputs> = async (values) => {
    if (!app?.id) {
      return;
    }
    try {
      const apiKeyResult = await API.app.getAPIKey(app!.id);
      const { data: apiKey } = apiKeyResult.data;
      const res = await API.app.uploadAppVersion(app!.id, {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { status }: { data: any; status: any } = res.data;
      if (status.code === 1000) {
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
    if (!app?.id) {
      return;
    }
    try {
      const res = await API.app.searchJiraIssues(app!.id, inputValue);
      const {
        data: { items },
      } = res.data;
      return items;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const promiseOptions = async (inputValue: string) => {
    if (inputValue.length === 0) {
      return [];
    }
    const issues = await searchJiraIssues(inputValue);
    return (
      issues?.map((i) => {
        return {
          value: i.key,
          label: (
            <span className="flex">
              <div
                className="min-w-fit w-fit"
                dangerouslySetInnerHTML={{ __html: i.keyHtml }}
              />
              <p className="ml-2 whitespace-pre-wrap">{i.summaryText}</p>
            </span>
          ),
        };
      }) ?? []
    );
  };

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <>
      {isSubmitting && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-[99999] bg-blue-gray-400/20">
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
          onEscapeKeyDown={(e) => {
            if (isSubmitting) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            if (isSubmitting) {
              e.preventDefault();
            }
          }}
          className="!w-full max-h-[85%] overflow-scroll"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              id="edit-form"
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-screen-sm mx-auto mt-8 mb-2"
            >
              <div className="flex flex-col gap-2 mb-4">
                <FormField
                  name="name"
                  control={control}
                  rules={{
                    required: t("Version Name is required"),
                  }}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="font-bold" color="blue-gray">
                          {t("Version Name")}
                        </FormLabel>
                        <Input {...field} disabled={isSubmitting} />
                        <FormDescription>
                          {t("eg")}: &apos;Version 1.0.0&apos;
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  name="description"
                  control={control}
                  rules={{
                    required: t("Version Description is required"),
                  }}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="font-bold" color="blue-gray">
                          {t("Description")}
                        </FormLabel>
                        <Textarea {...field} disabled={isSubmitting} />
                        <FormDescription>
                          {t("This is the description of the version")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <FormField
                  name="tags"
                  control={control}
                  rules={{
                    required: t("Tags is required"),
                  }}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="font-bold" color="blue-gray">
                          {t("Tags")}
                        </FormLabel>
                        <Input {...field} disabled={isSubmitting} />
                        <FormDescription>
                          {t("eg")}: &apos;Android,UAT,APK&apos;
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  name="installPassword"
                  control={control}
                  rules={{
                    required: t("Install Password is required"),
                  }}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t("Install Password")}</FormLabel>
                        <Input {...field} disabled={isSubmitting} />
                        <FormDescription>
                          {t("This is the password for the install page")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              {app?.extra?.jiraCredential && (
                <div className="py-2 my-2 border-y">
                  <div className="my-2">
                    <FormField
                      name="jiraIssues"
                      control={control}
                      rules={{
                        required: false,
                      }}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className="font-bold" color="blue-gray">
                              {t("Jira Issues Connect")}
                            </FormLabel>
                            <AsyncSelect
                              ref={field.ref}
                              cacheOptions
                              defaultOptions
                              isMulti
                              loadOptions={promiseOptions}
                              onChange={(e) => {
                                setValue(
                                  "jiraIssues",
                                  e.map((i) => i.value)
                                );
                              }}
                            />
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="mt-4">
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
          <DialogFooter>
            <Button
              onClick={() => {
                if (!isSubmitting) {
                  form.handleSubmit(onSubmit)();
                }
              }}
            >
              <span>{t("Done")}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadVersionDialog;
