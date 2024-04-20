import RegisterForm from '@/app/[locale]/register/_components/registerForm';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `Login - App Center`,
  description: '',
};

const RegisterPage = () => {
  const t = useTranslations('Auth');
  return (
    <section className="h-full">
      <div className="container relative flex-col items-center justify-center h-full md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative flex-col hidden h-full p-10 text-white bg-muted lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900"></div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            App Center
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                “This library has saved me countless hours of work and helped me
                deliver stunning designs to my clients faster than ever before.”
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full p-4 flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t('Create an account')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('Enter your email below to create your account')}
              </p>
            </div>
            <div className="grid gap-6">
              <RegisterForm />
            </div>
            <p className="px-8 text-sm text-center text-muted-foreground">
              {t('Already have an account')}{' '}
              <Link
                className="underline underline-offset-4 hover:text-primary"
                href="/login"
              >
                {t('Login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
