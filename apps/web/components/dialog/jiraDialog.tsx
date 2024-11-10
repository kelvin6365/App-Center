import Loading from "@/components/loading";
import useUserProfileQuery from "@/queries/useUserProfileQuery";
import API from "@/services/api";
import useTeamSelectionStore from "@/stores/useTeamSelectionStore";
import { App } from "@/types/App";
import { RoleType } from "@/types/RoleType";
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
  FormDescription,
  FormControl,
  FormMessage,
} from "@repo/ui/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Switch } from "@repo/ui/components/ui/switch";
import { useTranslations } from "next-intl";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdOpenInNew } from "react-icons/md";
type Props = {
  title: string;
  description?: string;
  onClose: (reload: boolean) => void;
  open: boolean;
  app: App | null;
};

const JiraDialog = ({ title, onClose, open, app, description }: Props) => {
  const t = useTranslations("Apps");
  const { selectedTeam } = useTeamSelectionStore();
  const { userProfile } = useUserProfileQuery();
  const [jiraCredentials, setJiraCredentials] = useState([]);

  const form = useForm<{ selectedId: string; enabled: boolean }>({
    mode: "onChange",
    //TODO: add validation
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      selectedId: app?.extra?.jiraCredential ?? "",
      enabled: app?.extra?.jiraCredential ? true : false,
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    control,
    reset,
  } = form;

  const getJiraCredentials = async () => {
    if (!selectedTeam) {
      return;
    }
    try {
      const res = await API.credential.getAllCredentials("jiraDomainBasicAuth");
      const { data } = res.data;
      setJiraCredentials(data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  const onSubmit = async (values: { selectedId: string; enabled: boolean }) => {
    try {
      const res = await API.app.patchApp(app!.id, {
        extra: {
          jiraCredential: values.enabled ? values.selectedId : null,
        },
      });
      const { data } = res.data;
      if (!data) {
        throw new Error("Failed to save app");
      }
      onClose(true);
      reset();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  useEffect(() => {
    if (app && open) {
      reset({
        selectedId: app?.extra?.jiraCredential ?? "",
        enabled: app?.extra?.jiraCredential ? true : false,
      });
      getJiraCredentials();
    }
  }, [app, open]);

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
          onClose(false);
          reset({
            selectedId: app?.extra?.jiraCredential ?? "",
            enabled: app?.extra?.jiraCredential ? true : false,
          });
        }}
        // className="!max-w-[70%] !w-full max-h-[85%] overflow-scroll"
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
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {app?.extra?.jiraURL ? (
            <a
              className="flex p-4 text-base font-bold whitespace-pre-wrap rounded-lg hover:bg-gray-400/40 w-fit hover:text-black"
              href={app?.extra?.jiraURL}
              target="_blank"
              rel="noreferrer"
            >
              {t("Go to Jira Board")} <MdOpenInNew className="w-5 h-5 ml-2" />
            </a>
          ) : (
            <span className="flex items-center gap-1 py-2 text-sm text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 -mt-px"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                {t(
                  "No Jira Board URL yet Please add Jira Board URL for this App"
                )}
              </p>
            </span>
          )}
          {(userProfile?.roles.map((r) => r.type).includes(RoleType.ADMIN) ??
            false) && (
            <>
              <section className="pt-4 pb-2 my-2 border-t">
                <span className="text-lg font-bold" color="blue-gray">
                  {t("Jira Integration")}
                </span>
                <span
                  color="gray"
                  className="flex items-center gap-1 text-sm font-light whitespace-pre-wrap"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 -mt-px"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {t(
                      "Please ensure that you have created the credential for your Jira Project"
                    )}
                  </span>
                </span>
                <Link
                  href="/team/settings/credentials"
                  className="text-sm font-bold text-blue-500"
                >
                  {t("Go to Credentials")}
                </Link>
              </section>
              <Form {...form}>
                <form
                  className="grid grid-cols-1 gap-4 mb-2"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="enabled"
                    rules={{ required: false }}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>{t("Enable")}</FormLabel>
                          <FormDescription>
                            {t("Enable Jira Integration")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {watch("enabled") && (
                    <FormField
                      name="selectedId"
                      control={control}
                      rules={{
                        required: t("Please select a Jira Credential"),
                      }}
                      render={({ field, fieldState: { error } }) => {
                        return (
                          <FormItem>
                            <FormLabel>{t("Jira Credential")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t(
                                      "Please select a Jira Credential"
                                    )}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {jiraCredentials.map(
                                  (jiraCredential: {
                                    id: string;
                                    name: string;
                                  }) => {
                                    return (
                                      <SelectItem
                                        key={jiraCredential.id}
                                        value={jiraCredential.id}
                                      >
                                        {jiraCredential.name}
                                      </SelectItem>
                                    );
                                  }
                                )}
                              </SelectContent>
                            </Select>
                            {error?.message && (
                              <span className="flex items-center gap-1 mt-2 text-sm font-normal text-red-500">
                                {error.message}
                              </span>
                            )}
                          </FormItem>
                        );
                      }}
                    />
                  )}
                </form>
              </Form>
            </>
          )}
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

export default JiraDialog;
