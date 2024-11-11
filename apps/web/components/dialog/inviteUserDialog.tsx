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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import API from "../../services/api";
import { RoleIdType } from "../../types/RoleIdType";

type Props = {
  title: string;
  description: string;
  onClose: (reload: boolean) => void;
  open: boolean;
};
type InviteFormInputs = {
  email: string;
  role: string;
};

const InviteUserDialog = ({ title, onClose, open, description }: Props) => {
  const t = useTranslations("Members");

  const form = useForm<InviteFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      email: "",
      role: "",
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
  } = form;

  const onSubmit: SubmitHandler<InviteFormInputs> = async (values) => {
    try {
      const res = await API.user.inviteUserToTenant({
        email: values.email,
        role: values.role as RoleIdType,
      });
      const { status } = res.data;
      if (status.code === 1000) {
        onClose(true);
        cleanUp();
        toast.success(t("Invite Successfully"));
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  const cleanUp = () => {
    reset({
      email: "",
      role: "",
    });
  };

  useEffect(() => {
    return () => {
      cleanUp();
    };
  }, []);

  return (
    <>
      {isSubmitting && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-[99999] bg-blue-gray-400/20">
          <Loading fullScreen />
        </div>
      )}
      <Dialog open={open} onOpenChange={() => !isSubmitting && onClose(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              id="invite-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 py-4"
            >
              <FormField
                name="email"
                control={control}
                rules={{
                  required: t("Email is required"),
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: t("Email is invalid"),
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Email")}</FormLabel>
                    <Input
                      {...field}
                      type="email"
                      disabled={isSubmitting}
                      placeholder="user@example.com"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="role"
                control={control}
                rules={{
                  required: t("Role is required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Role")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("Please select a role")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(RoleIdType).map((key) => (
                          <SelectItem key={key} value={key}>
                            <span className="capitalize">
                              {key.toLowerCase()}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => onClose(false)}
              disabled={isSubmitting}
            >
              {t("Cancel")}
            </Button>
            <Button type="submit" form="invite-form" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  {t("Inviting_dot")}
                </>
              ) : (
                t("Invite")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteUserDialog;
