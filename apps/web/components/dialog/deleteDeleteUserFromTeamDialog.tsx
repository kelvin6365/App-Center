import { Icons } from "@/components/icons";
import Loading from "@/components/loading";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import API from "../../services/api";
import { PortalUserProfile } from "../../types/PortalUserProfile";

type Props = {
  title: string;
  description?: string;
  onClose: (reload: boolean) => void;
  open: boolean;
  user: PortalUserProfile | null;
};
type DeleteVersionFormInputs = {
  id: string;
};
const DeleteUserFromTeamDialog = ({
  title,
  onClose,
  open,
  user,
  description,
}: Props) => {
  const t = useTranslations("Members");

  const form = useForm<DeleteVersionFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      id: user?.id,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (open) {
      reset({
        id: user?.id,
      });
    }
  }, [open, reset, user]);

  const onSubmit: SubmitHandler<DeleteVersionFormInputs> = async (values) => {
    try {
      const res = await API.user.removeUserFromTenant({
        userId: values.id,
      });
      const { status } = res.data;
      if (status.code === 1000) {
        onClose(true);
        reset();
        toast.success(t("Remove Successfully"));
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
                {t("Are you sure you want to remove this user")}
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground">
                  {t("Name")}:
                </span>
                <span className="col-span-2">{user?.profile?.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground">
                  {t("Username")}:
                </span>
                <span className="col-span-2">{user?.username}</span>
              </div>
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
                  {t("Removing_dot")}
                </>
              ) : (
                t("Remove")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteUserFromTeamDialog;
