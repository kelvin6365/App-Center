import useAvailableTenantsStore from "@/queries/useAvailableTenantsQuery";
import useTeamSelectionStore from "@/stores/useTeamSelectionStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/ui/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { cn } from "@repo/ui/lib/utils";
import axios from "axios";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import useUserProfileQuery from "../../queries/useUserProfileQuery";
import { createTeamFormSchema } from "../../schema/tenant";
import API from "../../services/api";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

type TeamSwitcherProps = PopoverTriggerProps;

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const t = useTranslations("Common");
  const { selectedTeam, setSelectedTeam } = useTeamSelectionStore();
  const { refetch: userProfileRefetch } = useUserProfileQuery();
  const [isTenantSelectOpen, setIsTenantSelectOpen] = React.useState(false);
  const [showNewTenantDialog, setShowNewTenantDialog] = React.useState(false);
  const { availableTenants, isLoading, isError, error, refetch } =
    useAvailableTenantsStore();

  const form = useForm<z.infer<typeof createTeamFormSchema>>({
    resolver: zodResolver(createTeamFormSchema),
    defaultValues: {
      name: "",
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const groups = [
    {
      label: t("Teams"),
    },
  ];

  const onSubmit = async (values: z.infer<typeof createTeamFormSchema>) => {
    try {
      const {
        data: {
          data: { id, name },
        },
      } = await API.tenant.createTenant({
        name: values.name,
      });
      if (id) {
        toast.success(t("Created Tenant Successfully"));
        refetch();
        userProfileRefetch();
        setSelectedTeam({
          id,
          name,
        });
        setShowNewTenantDialog(false);
        reset();
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  React.useEffect(() => {
    if (!selectedTeam && availableTenants.length > 0) {
      setSelectedTeam({
        id: availableTenants[0].id,
        name: availableTenants[0].name,
      });
    }
  }, [availableTenants, selectedTeam, setSelectedTeam]);

  return (
    <Dialog open={showNewTenantDialog} onOpenChange={setShowNewTenantDialog}>
      <Popover open={isTenantSelectOpen} onOpenChange={setIsTenantSelectOpen}>
        <PopoverTrigger asChild>
          {(selectedTeam || availableTenants.length === 0) && !isLoading ? (
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isTenantSelectOpen}
              aria-label={t("Select a team")}
              disabled={availableTenants.length === 0}
              className={cn("w-full justify-between", className)}
            >
              {selectedTeam ? (
                <>
                  <Avatar className="w-5 h-5 mr-2">
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${selectedTeam.name}`}
                      alt={selectedTeam.name}
                    />
                    <AvatarFallback>-</AvatarFallback>
                  </Avatar>
                  {selectedTeam.name}
                  <CaretSortIcon className="w-4 h-4 ml-auto opacity-50 shrink-0" />
                </>
              ) : (
                <p>{t("You did not have any team yet")}</p>
              )}
            </Button>
          ) : (
            <>
              <Skeleton className="w-full h-[36px] rounded-md mb-4" />
            </>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder={t("Search team") + "..."} />
              <CommandEmpty>{t("No team found")}</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {selectedTeam &&
                    availableTenants.map(
                      ({ id, name }: { id: string; name: string }) => (
                        <CommandItem
                          key={id}
                          onSelect={() => {
                            setSelectedTeam({
                              id,
                              name,
                            });
                            setIsTenantSelectOpen(false);
                          }}
                          className="text-sm"
                          value={id}
                        >
                          <Avatar className="w-5 h-5 mr-2">
                            <AvatarImage
                              src={`https://ui-avatars.com/api/?name=${name}`}
                              alt={name}
                            />
                            <AvatarFallback>-</AvatarFallback>
                          </Avatar>
                          {name}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedTeam.id === id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      )
                    )}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setIsTenantSelectOpen(false);
                      setShowNewTenantDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="w-5 h-5 mr-2" />
                    {t("Create Team")}
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{t("Create Team")}</DialogTitle>
              <DialogDescription>
                {t("Add a new team to manage products and customers")}
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="py-2 pb-4 space-y-4">
                <div className="space-y-2">
                  {/* <Label htmlFor="name">{t('Team name')}</Label>
                  <Input id="name" placeholder="Acme Inc." /> */}

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Team name")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Acme Inc."
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="plan">Subscription plan</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">
                        <span className="font-medium">Free</span> -{' '}
                        <span className="text-muted-foreground">
                          Trial for two weeks
                        </span>
                      </SelectItem>
                      <SelectItem value="pro">
                        <span className="font-medium">Pro</span> -{' '}
                        <span className="text-muted-foreground">
                          $9/month per user
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setShowNewTenantDialog(false)}
              >
                {t("Cancel")}
              </Button>
              <Button disabled={isSubmitting} type="submit">
                {t("Continue")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
