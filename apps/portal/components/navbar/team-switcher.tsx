import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  Skeleton,
} from '@app-center/shadcn/ui';
import { cn } from '@app-center/shadcn/util';
import { useQuery } from '@tanstack/react-query';

import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons';
import React from 'react';
import API from '@/services/api';

const groups = [
  {
    label: 'Teams',
  },
];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

type TeamSwitcherProps = PopoverTriggerProps;

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<any>(null);

  // Queries
  const { data, isLoading } = useQuery({
    queryKey: ['availableTenants', selectedTeam],
    queryFn: async () => {
      const { data } = await API.user.getAvailableTenants();
      if (!selectedTeam) {
        setSelectedTeam(data.data.items[0]);
      }
      return data.data;
    },
  });
  const availableTenants = React.useMemo(() => data?.items ?? [], [data]);

  console.log(availableTenants);
  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {selectedTeam ? (
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select a team"
              className={cn('w-full justify-between', className)}
            >
              <Avatar className="w-5 h-5 mr-2">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${selectedTeam.name}.png`}
                  alt={selectedTeam.name}
                  className="grayscale"
                />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              {selectedTeam.name}
              <CaretSortIcon className="w-4 h-4 ml-auto opacity-50 shrink-0" />
            </Button>
          ) : (
            <Skeleton className="w-full h-[36px] rounded-md mb-4" />
          )}
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {availableTenants.map(
                    ({ id, name }: { id: string; name: string }) => (
                      <CommandItem
                        key={id}
                        onSelect={() => {
                          setSelectedTeam({
                            id,
                            name,
                          });
                          setOpen(false);
                        }}
                        className="text-sm"
                      >
                        <Avatar className="w-5 h-5 mr-2">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${name}.png`}
                            alt={name}
                            className="grayscale"
                          />
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        {name}
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedTeam.id === id ? 'opacity-100' : 'opacity-0'
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
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="w-5 h-5 mr-2" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="py-2 pb-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
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
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
