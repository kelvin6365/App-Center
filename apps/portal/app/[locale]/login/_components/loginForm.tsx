'use client';
import { loginFormSchema } from '@/schema/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@app-center/shadcn/ui';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
const LoginForm = () => {
  const router = useRouter();
  const query = useSearchParams();
  const t = useTranslations('Auth');
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    const { error } =
      (await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false,
      })) ?? {};
    if (error) {
      //Login failed.
      console.error('Login failed');
      toast.error(t('Status.LoginFailed'));
    } else {
      //Login success.
      //check have callbackUrl in query string
      const callbackUrl = query.get('callbackUrl');
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push('/console');
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Username')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@mail.com"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Password')}</FormLabel>
                <FormControl>
                  <Input type={'password'} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {t('Login')}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-background text-muted-foreground">
            {t('Or continue with')}
          </span>
        </div>
      </div>
      <Button variant={'outline'} disabled={isSubmitting}>
        GitHub
      </Button>
    </>
  );
};

export default LoginForm;
