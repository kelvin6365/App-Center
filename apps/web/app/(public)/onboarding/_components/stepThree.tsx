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

const StepThree = () => {
  const t = useTranslations("OnBoarding");
  const {
    watch,
    control,
    formState: { isSubmitting, errors },
  } = useFormContext();
  return (
    <div className="items-center">
      <h4 className="text-center">{t("Create Your Team")}</h4>
      <h1 className="text-2xl text-center">
        {t(
          "Give your team a name to collaborate and work together effectively",
        )}
      </h1>

      <div className="py-12">
        <FormField
          control={control}
          name="tenantName"
          rules={{
            required: t("Name is required"),
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Team Name")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("Enter your team name")}
                  disabled={isSubmitting}
                />
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
          watch("tenantName") === "" || errors["tenantName"]
            ? true
            : false || watch("step") !== 2
        }
      >
        {t("Submit")}
      </Button>
    </div>
  );
};
export default StepThree;
