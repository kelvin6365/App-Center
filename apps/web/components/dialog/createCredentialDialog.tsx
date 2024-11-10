import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
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
      <DialogContent className="w-full max-w-[536px] max-h-[85%] overflow-scroll">
        <DialogHeader>
          {type && (
            <div className="flex">
              <img
                src={type?.icon}
                alt={type.label + " icon"}
                className="object-cover w-12 h-12 p-2 rounded-full group-hover:bg-white"
              />
              <p className="my-auto ml-2">{title}</p>
            </div>
          )}
        </DialogHeader>
        {type && (
          <div
            className="mb-2 text-xs"
            dangerouslySetInnerHTML={{ __html: type.description }}
          />
        )}
        <Form {...form}>
          <form
            id="create-credential-form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mt-2 mb-2 space-y-2"
          >
            <Controller
              name="name"
              control={control}
              rules={{}}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="font-bold" color="blue-gray">
                      {t("Credential Name")}
                    </FormLabel>
                    <Input {...field} disabled={isSubmitting} />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {type?.inputs.map((input, index) => {
              return (
                <Controller
                  key={index}
                  name={input.name}
                  control={control}
                  rules={{
                    required: input.label + " is required",
                  }}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="font-bold" color="blue-gray">
                          {input.label}
                        </FormLabel>
                        <Input
                          {...field}
                          type={input.type as "password" | "text"}
                          disabled={isSubmitting}
                        />
                        <FormDescription>{input.placeholder}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              );
            })}
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="submit"
            form="create-credential-form"
            disabled={isSubmitting}
          >
            <span>{t("Done")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCredentialDialog;
