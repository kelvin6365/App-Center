import { Button } from '@material-tailwind/react';
import logo from '../../../assets/images/logo.jpg';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore, useBoundStore } from '../../util/store/store';
import API from '../../util/api';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loading from '../../../components/Loading/Loading';
import { Setting } from '../../util/type/Setting';
import TextInput from '../../../components/Input/Input';

type RegisterFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
};
const Register = () => {
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
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

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (values) => {
    try {
      const res = await API.auth.register(
        values.email,
        values.password,
        values.name
      );
      const { status } = res.data;
      if (status.code === 1000) {
        await autoLogin(values.email, values.password);
      } else {
        toast.error(status.displayMessage);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage);
      }
    }
  };

  const autoLogin = async (username: string, password: string) => {
    try {
      const res = await API.auth.login(username, password);
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
    } else {
      if (DISABLE_REGISTER.value === true) {
        navigate('/login', { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, navigate]);

  if (loading) {
    return <Loading />;
  }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <NavLink
          to={'/'}
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-8 h-8 mr-2" src={logo} alt="logo" />
          App Center
        </NavLink>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign up to App Center
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
                  disabled={isSubmitting}
                  type="email"
                  error={errors.email}
                />
              </div>
              <div>
                <TextInput
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  label={'Password'}
                  disabled={isSubmitting}
                  type="password"
                  error={errors.password}
                />
              </div>
              <div>
                <TextInput
                  {...register('confirmPassword', {
                    required: 'Confirm Password is required',
                    validate: (value) => {
                      return value === watch('password')
                        ? true
                        : 'Passwords do not match';
                    },
                  })}
                  label={'Confirm Password'}
                  disabled={isSubmitting}
                  type="password"
                  error={errors.confirmPassword}
                />
              </div>
              <div>
                <TextInput
                  {...register('name', {
                    required: 'Name is required',
                  })}
                  label={'Name'}
                  disabled={isSubmitting}
                  error={errors.name}
                />
              </div>
              <Button disabled={isSubmitting} className="w-full" type="submit">
                Sign Up
              </Button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <NavLink
                  to={'/login'}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
