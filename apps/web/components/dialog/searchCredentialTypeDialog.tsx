import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CredentialComponent } from "../../types/CredentialComponent";
import { useTranslations } from "next-intl";
import useAvailableCredentialComponentsQuery from "../../queries/useAvailableCredentialComponentsQuery";
import useTeamSelectionStore from "../../stores/useTeamSelectionStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";

type Props = {
  title: string;
  description: string;
  onClose: () => void;
  open: boolean;
  onSelect: (component: CredentialComponent) => void;
};
type SearchCredentialTypeFormInputs = {
  search: string;
};

const SearchCredentialTypeDialog = ({
  title,
  onClose,
  open,
  description,
  onSelect,
}: Props) => {
  const t = useTranslations("Credentials");
  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      search: "",
    },
    shouldFocusError: false,
  });
  const {
    watch,
    setValue,
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  const onSubmit: SubmitHandler<SearchCredentialTypeFormInputs> = async (
    values
  ) => {
    console.log(values);
  };

  //Search credential name with case sensitive
  const searchCredentialName = watch("search");

  //Current selected team
  const { selectedTeam } = useTeamSelectionStore();
  //Fetch credential components
  const { availableCredentialComponents, isLoading } =
    useAvailableCredentialComponentsQuery({ selectedTeam });

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!isSubmitting) {
          setValue("search", "");
          onClose();
        }
      }}
    >
      <DialogContent className="w-full max-w-[536px] max-h-[85%] overflow-scroll">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="credential-form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mt-2 mb-2"
          >
            <div className="w-full my-2">
              <Controller
                name="search"
                control={control}
                rules={{}}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <FormItem>
                      <FormLabel className="font-bold" color="blue-gray">
                        {t("Search Credential Type")}
                      </FormLabel>
                      <Input {...field} disabled={isSubmitting} />
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </form>
        </Form>
        {availableCredentialComponents
          .filter(
            (c) =>
              c.label
                .toLowerCase()
                .indexOf(searchCredentialName?.toLowerCase()) !== -1
          )
          .map((component, i) => (
            <div
              key={i}
              className="flex px-4 py-2 rounded-md cursor-pointer hover:bg-purple-200/30 group"
              onClick={() => onSelect(component)}
            >
              <img
                src={component?.icon}
                alt={component.label + " icon"}
                className="object-cover w-12 h-12 p-2 rounded-full group-hover:bg-white"
              />
              <p className="my-auto ml-3 text-sm">{component.label}</p>
            </div>
          ))}
        <DialogFooter>
          <Button type="submit" form="credential-form" disabled={isSubmitting}>
            <span>{t("Done")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SearchCredentialTypeDialog;
