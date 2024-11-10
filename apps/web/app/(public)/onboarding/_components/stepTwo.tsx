import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

const StepTwo = () => {
  const t = useTranslations("OnBoarding");
  const {
    watch,
    setValue,
    control,
    formState: { isSubmitting, errors },
    trigger,
  } = useFormContext();
  return (
    <div className="items-center">
      <h4 className="text-center">{t("Personal Information")}</h4>
      <h1 className="text-2xl text-center">{t("Please enter your name")}:</h1>

      <div className="py-12">
        <FormField
          control={control}
          name="name"
          rules={{
            required: t("Name is required"),
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Your Name")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Next Button */}
      <Button
        className="w-full"
        disabled={
          watch("name") === "" || errors["name"]
            ? true
            : false || watch("step") !== 1
        }
        onClick={() => {
          setValue("tenantName", `${watch("name")}'s Team`);
          setValue("step", 2);
          trigger(["tenantName"]);
        }}
      >
        {t("Next")}
      </Button>
    </div>
  );
};
export default StepTwo;
