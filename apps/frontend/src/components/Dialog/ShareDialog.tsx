import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Tooltip,
} from '@material-tailwind/react';
import { useState } from 'react';
import { IoIosCopy } from 'react-icons/io';
import { TiTick } from 'react-icons/ti';
import { AppVersion } from '../../app/util/type/AppVersion';

type Props = {
  title: string;
  onClose: () => void;
  open: boolean;
  data: AppVersion;
};

const ShareDialog = ({ title, onClose, open, data }: Props) => {
  const [copied, setCopied] = useState(false);
  return (
    <Dialog
      open={open}
      handler={() => {
        onClose();
      }}
      className="!max-w-[70%] !w-full max-h-[85%] overflow-scroll"
    >
      <DialogHeader>{title}</DialogHeader>
      <DialogBody divider>
        <div className="flex my-2 mt-4">
          <span
            className="inline-flex text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 cursor-pointer rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
            onClick={() => {
              if (!copied) {
                setCopied(true);
                navigator.clipboard.writeText(
                  `${window.location.origin}/install/${data.appId}?versionId=${data.id}`
                );
                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }
            }}
          >
            {!copied ? (
              <div className="relative flex">
                <IoIosCopy className="m-auto mx-3" />
              </div>
            ) : (
              <div className="m-auto">
                <Tooltip content="Copied" trigger="hover" className="relative">
                  <div className="relative">
                    <IoIosCopy className="mx-3" />
                    <TiTick className="absolute right-[0px] bottom-[-8px] text-green-400" />
                  </div>
                </Tooltip>
              </div>
            )}
          </span>
          <input
            type="text"
            id="website-admin"
            className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={`${window.location.origin}/install/${data.appId}?versionId=${data.id}`}
            readOnly
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="gradient"
          onClick={() => {
            onClose();
          }}
        >
          <span>Done</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ShareDialog;
