import LoginForm from '@/app/[locale]/login/_components/loginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Login - App Center`,
  description: '',
};

const LoginPage = () => {
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
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account
              </p>
            </div>
            <div className="grid gap-6">
              <LoginForm />
            </div>
            <p className="px-8 text-sm text-center text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <a
                className="underline underline-offset-4 hover:text-primary"
                href="/terms"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                className="underline underline-offset-4 hover:text-primary"
                href="/privacy"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
