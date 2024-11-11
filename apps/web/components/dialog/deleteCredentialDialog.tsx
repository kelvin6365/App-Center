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

import { Icons } from "@/components/icons";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAvailableCredentialComponentsQuery from "../../queries/useAvailableCredentialComponentsQuery";
import useTeamSelectionStore from "../../stores/useTeamSelectionStore";
import { Credential } from "../../types/Credential";

type Props = {
  title: string;
  description?: string;
  onClose: (reload: boolean) => void;
  open: boolean;
  credential: Credential | null;
};
type DeleteCredentialFormInputs = {
  id: string;
};
const DeleteCredentialDialog = ({
  title,
  onClose,
  open,
  credential,
  description,
}: Props) => {
  const t = useTranslations("Credentials");
  //Current selected team
  const { selectedTeam } = useTeamSelectionStore();
  //Fetch credential components
  const { availableCredentialComponents, isLoading } =
    useAvailableCredentialComponentsQuery({ selectedTeam });
  const form = useForm<DeleteCredentialFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      id: credential?.id,
    },
  });
  const target = availableCredentialComponents.find(
    (c) => c.name === credential?.credentialName,
  );
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (open) {
      reset({
        id: credential?.id,
      });
    }
  }, [open, reset, credential]);

  const onSubmit: SubmitHandler<DeleteCredentialFormInputs> = async (
    values,
  ) => {
    try {
      const res = await API.credential.deleteCredential(values.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { status }: { data: any; status: any } = res.data;
      console.log(status);
      if (status.code === 1000) {
        onClose(true);
        reset();
        toast.success("Delete successfully");
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };
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
        // className="!max-w-[70%] !w-full max-h-[85%] overflow-scroll"
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-500">
              {title}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-3 text-red-600">
              <Icons.alertTriangle className="h-5 w-5" />
              <p className="font-medium">
                {t("Are your sure to delete this credential")}
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <img
                src={target?.icon}
                alt={credential?.credentialName + " icon"}
                className="w-10 h-10 p-2 border rounded-full"
              />
              <span className="font-medium">{credential?.name}</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => onClose(false)}
              disabled={isSubmitting}
            >
              {t("Cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleSubmit(onSubmit)()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  {t("Deleting_dot")}
                </>
              ) : (
                t("Delete")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteCredentialDialog;
