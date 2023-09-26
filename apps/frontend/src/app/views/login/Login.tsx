import { Button } from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../../assets/images/logo.jpg';
import TextInput from '../../../components/Input/TextInput';
import API from '../../util/api';
import { useAppStore, useBoundStore } from '../../util/store/store';
import { Setting } from '../../util/type/Setting';
import Loading from '../../../components/Loading/Loading';

type LoginFormInputs = {
  email: string;
  password: string;
};
const Login = () => {
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {},
  });

  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [setLoggedIn, isLoggedIn] = useAppStore((state: any) => [
    state.setLoggedIn,
    state.isLoggedIn,
  ]);
  const [setSettings, settings] = useBoundStore((state) => [
    state.setSettings,
    state.settings,
  ]);
  const { config: DISABLE_REGISTER }: Setting = settings.find(
    (setting) => setting.key === 'DISABLE_REGISTER'
  ) ?? {
    id: 'DEFAULT',
    key: 'DISABLE_REGISTER',
    config: { value: true },
  };

  //fetch settings
  const fetchInitData = async () => {
    try {
      const [settingsRes] = await Promise.all([API.setting.getAllSettings()]);
      setSettings(settingsRes.data.data.settings);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = async (values) => {
    try {
      const res = await API.auth.login(values.email, values.password);
      const { data } = res.data;
      toast.success('Welcome!');
      setLoggedIn(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage);
      }
    }
  };

  useEffect(() => {
    fetchInitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/apps', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <NavLink
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-8 h-8 mr-2" src={logo} alt="logo" />
          App Center
        </NavLink>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <TextInput
                  {...register('email', {
                    required: 'Email is required',
                  })}
                  label={'Email'}
                  loading={isSubmitting}
                  placeholder="name@company.com"
                  type="email"
                  errors={errors}
                />
              </div>
              <div>
                <TextInput
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  label={'Password'}
                  loading={isSubmitting}
                  placeholder="••••••••"
                  type="password"
                  errors={errors}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <p className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Forgot password?
                </p>
              </div>
              <Button disabled={isSubmitting} className="w-full" type="submit">
                Sign In
              </Button>
              {DISABLE_REGISTER.value === false && (
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{' '}
                  <NavLink
                    to={'/register'}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </NavLink>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
