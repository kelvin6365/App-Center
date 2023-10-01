import { MainButton } from '@app-center/shared-ui';
import {
  Dialog,
  DialogBody,
  DialogHeader,
  Option,
  Select,
  Switch,
  Typography,
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdOpenInNew } from 'react-icons/md';
import { SiJirasoftware } from 'react-icons/si';
import { NavLink } from 'react-router-dom';
import API from '../../app/util/api';
import { useAppStore } from '../../app/util/store/store';
import { App } from '../../app/util/type/App';

type Props = {
  title: string;
  onClose: (reload: boolean) => void;
  open: boolean;
  app: App;
};

const JiraDialog = ({ title, onClose, open, app }: Props) => {
  const [selectedTenant] = useAppStore((state) => [state.selectedTenant]);
  const [jiraCredentials, setJiraCredentials] = useState([]);

  const {
    handleSubmit,
    // formState: { errors, isSubmitting },
    watch,
    control,
    reset,
  } = useForm<{ selectedId: string; enabled: boolean }>({
    mode: 'onChange',
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      selectedId: app.extra?.jiraCredential ?? '',
      enabled: app.extra?.jiraCredential ? true : false,
    },
  });

  const getJiraCredentials = async () => {
    if (!selectedTenant) {
      return;
    }
    try {
      const res = await API.credential.getAllCredentials(
        selectedTenant?.id,
        'jiraDomainBasicAuth'
      );
      const { data } = res.data;
      setJiraCredentials(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (values: { selectedId: string; enabled: boolean }) => {
    try {
      const res = await API.app.patchApp(app.id, {
        extra: {
          jiraCredential: values.enabled ? values.selectedId : null,
        },
      });
      const { data } = res.data;
      if (!data) {
        throw new Error('Failed to save app');
      }
      onClose(true);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    reset({
      selectedId: app.extra?.jiraCredential ?? '',
      enabled: app.extra?.jiraCredential ? true : false,
    });
    getJiraCredentials();
  }, [app]);

  return (
    <Dialog
      open={open}
      handler={() => {
        onClose(false);
        reset({
          selectedId: app.extra?.jiraCredential ?? '',
          enabled: app.extra?.jiraCredential ? true : false,
        });
      }}
      className="!max-w-[50%] !w-full max-h-[85%] overflow-scroll"
    >
      <DialogHeader>
        <div className="flex">
          <SiJirasoftware className="my-auto text-blue-500 w-7 h-7" />
          <p className="my-auto ml-2">{title}</p>
        </div>
      </DialogHeader>
      <DialogBody divider>
        {app?.extra?.jiraURL ? (
          <a
            className="flex p-4 text-base font-bold whitespace-pre-wrap rounded-lg hover:bg-gray-400/40 w-fit hover:text-black"
            href={app?.extra?.jiraURL}
            target="_blank"
            rel="noreferrer"
          >
            Go to Jira Board <MdOpenInNew className="w-5 h-5 ml-2" />
          </a>
        ) : (
          <p className="flex items-center gap-1 py-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 -mt-px"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            No Jira Board URL yet! Please add Jira Board URL for this App,
          </p>
        )}
        <section className="py-4 my-2 border-t">
          <Typography variant="h4" color="blue-gray">
            Jira Integration
          </Typography>
          <Typography
            color="gray"
            className="flex items-center gap-1 mt-2 font-normal whitespace-pre-wrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 -mt-px"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Please ensure that you have created the credential for your Jira
              Project.
            </span>
          </Typography>
          <NavLink
            to="/setting?tab=credentials"
            className="font-bold text-blue-500"
          >
            Go to Credentials.
          </NavLink>
        </section>
        <form
          className="grid grid-cols-1 gap-4 mb-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="enabled"
            control={control}
            rules={{ required: false }}
            render={({ field, fieldState: { error } }) => {
              return (
                <Switch
                  ref={field.ref}
                  checked={field.value}
                  ripple={false}
                  className="h-full w-full checked:bg-[#2ec946]"
                  label={'Enable'}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  containerProps={{
                    className: 'w-11 h-6',
                    error: !!error,
                  }}
                  circleProps={{
                    className: 'before:hidden left-0.5 border-none',
                  }}
                />
              );
            }}
          />
          {watch('enabled') && (
            <Controller
              name="selectedId"
              control={control}
              rules={{
                required: 'Please select a Jira Credential',
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <div>
                    <Select
                      ref={field.ref}
                      color="blue"
                      label="Jira Credential"
                      // disabled={availableTenants.length <= 1}
                      value={field.value}
                      onBlur={field.onBlur}
                      error={!!error}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      {jiraCredentials.map(
                        (jiraCredential: { id: string; name: string }) => {
                          return (
                            <Option
                              key={jiraCredential.id}
                              value={jiraCredential.id}
                            >
                              {jiraCredential.name}
                            </Option>
                          );
                        }
                      )}
                    </Select>
                    {error?.message && (
                      <Typography
                        variant="small"
                        color="red"
                        className="flex items-center gap-1 mt-2 font-normal"
                      >
                        {error.message}
                      </Typography>
                    )}
                  </div>
                );
              }}
            />
          )}
          <MainButton type="submit">Save</MainButton>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default JiraDialog;
