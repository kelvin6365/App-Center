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
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from '@material-tailwind/react';
import React, { useCallback, useEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.jpg';
import MenuItems from './MenuItems';
import { useAppStore } from '../../app/util/store/store';
import { AppSlice } from '../../app/util/store/appSlice';

const Sidebar = () => {
  const setLogout = useAppStore((state: AppSlice) => state.setLogout);
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);
  const location = useLocation();

  const handleOpen = useCallback(
    (value: number) => {
      setOpen(open === value ? 0 : value);
    },
    [open]
  );
  const logout = () => {
    setLogout();
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
          alt="Altech"
          className="w-full h-full max-w-[32px] max-h-8 aspect-square"
        />
        <Typography variant="h5" color="blue-gray" className="hidden md:block">
          App Center
        </Typography>
      </div>
      <Scrollbars className="h-full">
        <List className="md:min-w-[240px] min-w-0 p-0 md:p2">
          {MenuItems.map((item, index) => {
            const { icon, label, children } = item;
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
