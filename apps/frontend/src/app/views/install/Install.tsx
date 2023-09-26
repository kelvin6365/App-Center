import { LockClosedIcon } from '@heroicons/react/24/solid';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from '@material-tailwind/react';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BiSolidDownload } from 'react-icons/bi';
import { ImQrcode } from 'react-icons/im';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../../assets/images/logo.jpg';
import Tag from '../../../components/Chip/Tag';
import QRCodeDialog from '../../../components/Dialog/QRCodeDialog';
import API from '../../util/api';
import { App } from '../../util/type/App';
import { AppVersion } from '../../util/type/AppVersion';
import isUuid, { useQuery } from '../../util/util';
import TextInput from '../../../components/Input/Input';

type InstallAppFormInputs = {
  password: string;
};
const Install = () => {
  const { id: appId } = useParams();
  const query = useQuery();
  const versionId = query.get('versionId');
  const navigate = useNavigate();
  const [app, setApp] = useState<App | null>(null);
  const [version, setVersion] = useState<AppVersion | null>(null);
  const [openQRCode, setOpenQRCode] = useState({
    open: false,
    data: '',
  });

  const [wrongPasswordCount, setWrongPasswordCount] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<InstallAppFormInputs>({
    defaultValues: {
      password: undefined,
    },
  });

  const getApp = async () => {
    if (!appId) {
      return;
    }
    try {
      const res = await API.app.publicInstallPageAppDetails(appId);
      const { data } = res.data;
      setApp(data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  const getVersion = async (password: string) => {
    if (wrongPasswordCount >= 5) {
      if (wrongPasswordCount === 5) {
        setTimeout(() => {
          setWrongPasswordCount(0);
        }, 30000);
      }
      setWrongPasswordCount(wrongPasswordCount + 1);
      return toast.warning('Please try again after 30s!');
    }
    if (!appId || !versionId) {
      return;
    }
    try {
      const res = await API.app.publicInstallPageAppVersion(
        appId,
        versionId,
        password
      );
      const { data } = res.data;
      setVersion(data.version);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.status?.code === 1014) {
          setWrongPasswordCount(wrongPasswordCount + 1);
        }
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  useEffect(() => {
    //TODO: check appid and versionId is uuid
    if (!appId || !versionId || !isUuid(appId) || !isUuid(versionId)) {
      navigate('/404');
    }

    getApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<InstallAppFormInputs> = async (values) => {
    await getVersion(values.password);
  };

  return (
    <div className="relative">
      <div className="top-0 left-0 right-0 flex md:absolute">
        <div className="flex items-center gap-4 p-2 mx-auto mb-2 md:mx-0 md:p-4">
          <img
            src={logo}
            alt="Altech"
            className="w-full h-full max-w-[32px] max-h-8 aspect-square"
          />
          <Typography variant="h5" color="blue-gray" className="block">
            App Center
          </Typography>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center md:pt-8 md:mt-0 md:h-screen">
        <Card className="w-full max-w-[24rem] m-auto">
          <CardHeader
            color="blue"
            floated={false}
            shadow={false}
            className="grid px-4 py-8 m-0 text-center rounded-b-none place-items-center"
          >
            <div className="w-24 h-24 mb-4 text-white border rounded-lg border-white/10 bg-white/10 overflow-clip">
              <img
                src={app?.iconFileURL}
                className="overflow-clip"
                alt={app?.name}
              />
            </div>
            <Typography variant="h3" color="white">
              {app?.name}
            </Typography>
            <Typography variant="h6" color="white">
              {app?.description}
            </Typography>
          </CardHeader>
          <CardBody>
            {version ? (
              <div>
                <div className="mb-4">
                  <p>Name : {version.name}</p>
                  <p>Description : {version.description}</p>
                  <p>
                    Created at :{' '}
                    {moment(version.createdAt).format('YYYY-MM-DD HH:mm:ss a')}
                  </p>
                </div>
                <div className="flex flex-wrap space-x-2">
                  {version.tags.map((tag) => {
                    return (
                      <Tag
                        key={tag.id}
                        className={'normal-case'}
                        value={tag.name}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-center p-2 mt-4 space-x-4 rounded-md bg-blue-gray-300/40">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="p-2 font-medium rounded-full hover:bg-white"
                    onClick={() => {
                      setOpenQRCode({
                        open: true,
                        data:
                          version.fileURL +
                          `?password=${getValues('password')}`,
                      });
                    }}
                  >
                    <ImQrcode className="w-5 h-5" />
                  </Typography>
                  <Typography
                    as="a"
                    href={
                      version.fileURL + `?password=${getValues('password')}`
                    }
                    variant="small"
                    color="blue-gray"
                    className="p-2 font-medium rounded-full hover:bg-white"
                  >
                    <BiSolidDownload className="w-5 h-5" />
                  </Typography>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 mt-2"
              >
                <div className="mb-4">
                  <TextInput
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    type="password"
                    label="Password"
                    error={errors.password}
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={wrongPasswordCount === 6 || isSubmitting}
                >
                  Install Now
                </Button>
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-center gap-2 mt-2 font-normal opacity-60"
                >
                  <LockClosedIcon className="-mt-0.5 h-4 w-4" /> App install are
                  secure and encrypted
                </Typography>
              </form>
            )}
          </CardBody>
        </Card>
        <QRCodeDialog
          title={'QR Code'}
          open={openQRCode.open}
          onClose={() =>
            setOpenQRCode({
              open: false,
              data: '',
            })
          }
          qrCodeValue={openQRCode.data}
        />
      </div>
    </div>
  );
};

export default Install;
