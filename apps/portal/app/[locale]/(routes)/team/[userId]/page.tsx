'use client';
import React, { useEffect } from 'react';
import { z } from 'zod';
import CustomBreadcrumb from '@/components/breadcrumb/breadcrumb';
import { useTranslations } from 'next-intl';
import Custom404 from '@/components/404';
import { useRouter } from 'next/navigation';
import app from 'next/app';
import PageTitle from '@/components/content/pageTitle';
import useMemberQuery from '../../../../../queries/useMemberQuery';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from '@app-center/shadcn/ui';
import { useForm } from 'react-hook-form';
import API from '../../../../../services/api';
import axios from 'axios';
import toast from 'react-hot-toast';
import { RoleIdType } from '../../../../../types/RoleIdType';
import useTeamSelectionStore from '../../../../../stores/useTeamSelectionStore';

const paramsSchema = z.object({
  userId: z.string().uuid(),
});

type EditUserFormInputs = {
  name: string;
  role: string;
};

const ViewUser = ({ params }: { params: { userId: string } }) => {
  const isUserIdValid = paramsSchema.safeParse({
    userId: params.userId,
  }).success;
  const t = useTranslations('Members');
  const router = useRouter();

  //selected team
  const { selectedTeam } = useTeamSelectionStore();

  //Fetch User data
  const { user, isLoading, isError, error, refetch } = useMemberQuery({
    userId: params.userId,
    ready: isUserIdValid,
  });

  const form = useForm<EditUserFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      // name: user?.profile?.name ?? '',
      role:
        user?.roles.find((r) => r.tenantId === selectedTeam?.id)?.type ?? '',
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = form;

  const onSubmit = async (data: EditUserFormInputs) => {
    try {
      const result = await API.user.updateProfileById({
        id: user!.id,
        // name: data.name,
        role: data.role as RoleIdType,
      });
      toast.success(t('Updated Successfully'));
      refetch();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      reset({
        name: user?.profile?.name ?? '',
        role:
          user?.roles.find((r) => r.tenantId === selectedTeam?.id)?.type ?? '',
      });
    }

    return () => {
      reset();
    };
  }, [user]);

  if (isUserIdValid === false) {
    return (
      <div>
        <CustomBreadcrumb
          items={[
            {
              label: t('Team'),
              href: '/team',
            },
            {
              label: t('All Members'),
              href: '/team/members',
            },
            {
              label: `${'-'}`,
              href: `/team/${params.userId}`,
            },
          ]}
        />
        <div className="py-4">
          <Custom404
            title={t('Invalid Member ID')}
            description={t('Invalid Member ID description')}
            backBtnText={t('Back to All Members')}
            backBtnOnClick={() => {
              router.push('/team/members');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: t('Team'),
            href: '/team',
          },
          {
            label: t('All Members'),
            href: '/team/members',
          },
          {
            label: `${user?.profile?.name ?? ''}`,
            href: `/team/${params.userId}`,
          },
        ]}
      />
      <PageTitle
        isLoading={isLoading}
        title={user?.profile?.name ?? ''}
        description={user?.username ?? ''}
      />
      <div className="flex flex-col mt-2 lg:max-w-2xl">
        <div className="space-y-6">
          <Separator />
          <Form {...form}>
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              {/* <FormField
                name="name"
                control={control}
                rules={{
                  required: t('Name is required'),
                }}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="font-bold" color="blue-gray">
                        {t('Name')}
                      </FormLabel>
                      <Input {...field} disabled={isSubmitting} />

                      <FormMessage />
                    </FormItem>
                  );
                }}
              /> */}
              <FormField
                name="role"
                control={control}
                rules={{
                  required: t('Role is required'),
                }}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="font-bold" color="blue-gray">
                        {t('Role')}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t('Please select a role')}
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {Object.keys(RoleIdType).map((key, i) => {
                            return (
                              <SelectItem value={key} key={i}>
                                <p className="capitalize">
                                  {key.toLowerCase()}
                                </p>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button disabled={isSubmitting} type="submit">
                {t('Update')}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
