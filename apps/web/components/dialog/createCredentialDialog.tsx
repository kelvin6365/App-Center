import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import {
  Form,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Icons } from "@/components/icons";

import axios from "axios";
import { omit } from "lodash";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import API from "../../services/api";
import useTeamSelectionStore from "../../stores/useTeamSelectionStore";
import { CredentialComponent } from "../../types/CredentialComponent";
import { useEffect } from "react";

type Props = {
  title: string;
  onClose: () => void;
  open: boolean;
  type: CredentialComponent | null;
  onSuccess: () => void;
};
type CreateCredentialFormInputs = {
  name: string;
  credentialName: string;
  encryptedData: string;
  tenantId: string;
  [key: string]: any;
};

const CreateCredentialDialog = ({
  title,
  onClose,
  open,
  type,
  onSuccess,
}: Props) => {
  const t = useTranslations("Credentials");
  const { selectedTeam } = useTeamSelectionStore();
  const form = useForm<CreateCredentialFormInputs>();
  const {
    watch,
    setValue,
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = form;

  const onSubmit: SubmitHandler<CreateCredentialFormInputs> = async (
    values,
  ) => {
    console.log(values);
    if (!selectedTeam || !type) {
      return;
    }
    try {
      const res = await API.credential.createCredential({
        name: values.name,
        credentialName: type.name,
        encryptedData: omit(values, ["name"]),
        tenantId: selectedTeam?.id,
      });
      if (!res.data.data) {
        throw new Error("Credential create failed");
      }
      reset();
      onSuccess();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!isSubmitting) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="w-full max-w-xl">
        <DialogHeader>
          {type && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <img
                  src={type?.icon}
                  alt={type.label + " icon"}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <DialogTitle className="text-xl font-semibold">
                {title}
              </DialogTitle>
            </div>
          )}
        </DialogHeader>

        {type && (
          <div
            className="text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: type.description }}
          />
        )}

        <Form {...form}>
          <form
            id="create-credential-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <Controller
              name="name"
              control={control}
              rules={{}}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Credential Name")}</FormLabel>
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    placeholder={t("Enter credential name")}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {type?.inputs.map((input, index) => (
              <Controller
                key={index}
                name={input.name}
                control={control}
                rules={{
                  required: input.label + " is required",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{input.label}</FormLabel>
                    <Input
                      {...field}
                      type={input.type as "password" | "text"}
                      disabled={isSubmitting}
                      placeholder={input.placeholder}
                    />
                    <FormDescription className="text-xs">
                      {input.placeholder}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onClose()}
            disabled={isSubmitting}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            form="create-credential-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                {t("Creating_dot")}
              </>
            ) : (
              t("Create")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCredentialDialog;
