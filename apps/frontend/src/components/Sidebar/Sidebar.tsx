import {
  ChevronDownIcon,
  Cog6ToothIcon,
  CubeTransparentIcon,
  PowerIcon,
} from '@heroicons/react/24/solid';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Alert,
  Avatar,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Select,
  Typography,
  Option,
} from '@material-tailwind/react';
import React, { useCallback, useEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.jpg';
import MenuItems from './MenuItems';
import { useAppStore } from '../../app/util/store/store';
import { AppSlice } from '../../app/util/store/appSlice';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

const Sidebar = () => {
  const [setLogout, profile, availableTenants, setTenant, selectedTenant] =
    useAppStore((state: AppSlice) => [
      state.setLogout,
      state.profile,
      state.availableTenants,
      state.setTenant,
      state.selectedTenant,
    ]);
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);
  const location = useLocation();

  const {
    handleSubmit,
    // formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<{ selectedTenantId: string }>({
    mode: 'onChange',
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      selectedTenantId: selectedTenant?.id ?? '',
    },
  });

  const handleOpen = useCallback(
    (value: number) => {
      setOpen(open === value ? 0 : value);
    },
    [open]
  );
  const logout = () => {
    setLogout();
  };

  const onSelectTenant: SubmitHandler<{ selectedTenantId: string }> = async (
    values
  ) => {
    setTenant(
      availableTenants.find(
        (tenant) => tenant.id === values.selectedTenantId
      ) ?? null
    );
  };

  const initMenuOpen = useCallback(() => {
    handleOpen(
      // eslint-disable-next-line array-callback-return
      MenuItems.findIndex((menuItems) => {
        if (menuItems.children) {
          return (
            // eslint-disable-next-line array-callback-return
            menuItems.children.findIndex((children) => {
              if (children.path === location.pathname) {
                return true;
              }
            }) !== -1
          );
        } else {
          if (menuItems.path === location.pathname) {
            return true;
          }
        }
      }) + 1 ?? 0
    );
  }, [handleOpen, location.pathname]);
  useEffect(() => {
    initMenuOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="transform my-4 mx-2 md:mx-4 h-[calc(100vh-2rem)] min-w-[60px] w-fit md:w-full max-w-[20rem] py-4 px-2 md:p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="flex items-center gap-4 p-2 mb-2 md:p-4">
        <img
          src={logo}
          alt="App Center Logo"
          className="w-full h-full max-w-[32px] max-h-8 aspect-square"
        />
        <Typography variant="h5" color="blue-gray" className="hidden md:block">
          App Center
        </Typography>
      </div>
      <Scrollbars className="h-full">
        <NavLink to={'/account'} className="flex items-center gap-4 p-2">
          <Avatar
            alt="avatar"
            src={
              profile?.profile?.avatar ??
              'https://ui-avatars.com/api/?name=' +
                (profile?.profile?.name ?? '')
            }
            className="border border-blue-500 shadow-xl shadow-blue-900/20 ring-4 ring-blue-500/30"
          />
          <div className="hidden sm:block">
            <Typography
              variant="p"
              className="text-base font-bold"
              color="blue-gray"
            >
              {profile?.profile?.name ?? '-'}
            </Typography>
            <Typography color="gray" variant="p" className="text-xs font-light">
              {profile?.status ?? '-'}
            </Typography>
          </div>
        </NavLink>
        <form
          className="mt-3 mb-4 hidden md:block"
          onSubmit={handleSubmit(onSelectTenant)}
        >
          {/* <Typography className="text-sm font-bold">Tenants</Typography> */}
          <Controller
            name="selectedTenantId"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  ref={field.ref}
                  color="blue"
                  label="Tenant"
                  // disabled={availableTenants.length <= 1}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(e) => {
                    field.onChange(e);
                    handleSubmit(onSelectTenant)();
                  }}
                >
                  {availableTenants.map((availableTenants) => {
                    return (
                      <Option
                        key={availableTenants.id}
                        value={availableTenants.id}
                      >
                        {availableTenants.name}
                      </Option>
                    );
                  })}
                </Select>
              );
            }}
          />
        </form>

        <hr className="my-2 border-blue-gray-50" />
        <List className="md:min-w-[240px] min-w-0 p-0 md:p2">
          {MenuItems.map((item, index) => {
            const { icon, label, children, role } = item;
            if (role) {
              if (!profile?.roles.map((r) => r.type).includes(role)) {
                return null;
              }
            }
            return (
              <Accordion
                key={index}
                open={open === index + 1}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${
                      open === 1 ? 'rotate-180' : ''
                    }`}
                  />
                }
              >
                <ListItem className="p-0" selected={open === index + 1}>
                  <AccordionHeader
                    onClick={() => handleOpen(index + 1)}
                    className="p-3 border-b-0"
                  >
                    <ListItemPrefix>{icon}</ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="hidden mr-auto font-normal md:block"
                    >
                      {label}
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0 md:min-w-[240px] min-w-0">
                    {children.map((child, childIndex) => {
                      const {
                        icon: childIcon,
                        label: childLabel,
                        path: childPath,
                      } = child;
                      return (
                        <NavLink
                          key={childIndex}
                          to={childPath}
                          className={({ isActive }) =>
                            isActive
                              ? 'bg-blue-gray-50 bg-opacity-80 text-blue-gray-900 rounded-lg'
                              : undefined
                          }
                        >
                          <ListItem className="">
                            <ListItemPrefix>{childIcon}</ListItemPrefix>
                            <span className="hidden md:block">
                              {childLabel}
                            </span>
                          </ListItem>
                        </NavLink>
                      );
                    })}
                  </List>
                </AccordionBody>
              </Accordion>
            );
          })}

          <hr className="my-2 border-blue-gray-50" />
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'bg-blue-gray-50 bg-opacity-80 text-blue-gray-900 rounded-lg'
                : undefined
            }
            to={'/setting'}
          >
            <ListItem>
              <ListItemPrefix>
                <Cog6ToothIcon className="w-5 h-5" />
              </ListItemPrefix>
              <span className="hidden md:block">Settings</span>
            </ListItem>
          </NavLink>
          <div
            onClick={() => {
              logout();
            }}
          >
            <ListItem>
              <ListItemPrefix>
                <PowerIcon className="w-5 h-5" />
              </ListItemPrefix>
              <span className="hidden md:block">Log Out</span>
            </ListItem>
          </div>
        </List>
      </Scrollbars>

      <Alert
        open={openAlert}
        className="hidden mt-auto md:block"
        onClose={() => setOpenAlert(false)}
      >
        <CubeTransparentIcon className="w-12 h-12 mb-4" />
        <Typography variant="h6" className="mb-1">
          Upgrade to PRO
        </Typography>
        <Typography variant="small" className="font-normal opacity-80">
          Upgrade to PRO and get even more plugins, advanced features and
          premium.
        </Typography>
        <div className="flex gap-3 mt-4">
          <Typography
            as="a"
            href="#"
            variant="small"
            className="font-medium opacity-80"
            onClick={() => setOpenAlert(false)}
          >
            Dismiss
          </Typography>
          <Typography as="a" href="#" variant="small" className="font-medium">
            Upgrade Now
          </Typography>
        </div>
      </Alert>
    </Card>
  );
};

export default Sidebar;
