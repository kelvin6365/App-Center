import Loading from '@/components/loading';
import API from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@app-center/shadcn/ui';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { AppVersion } from '../../types/AppVersion';
import { App } from '../../types/App';
import { useState } from 'react';
import clsx from 'clsx';
import { MdDelete } from 'react-icons/md';
import Image from 'next/image';

type Props = {
  title: string;
  description?: string;
  onClose: () => void;
  onReload: () => Promise<void>;
  open: boolean;
  app: App | null;
  data: AppVersion | null;
};

const JiraIssuesDialog = ({
  title,
  onClose,
  onReload,
  open,
  app,
  data,
  description,
}: Props) => {
  const t = useTranslations('Apps');
  const [loading, setLoading] = useState(false);
  const onDelete = async (issueId: string) => {
    if (!app || !data) {
      return;
    }
    try {
      setLoading(true);
      const res = await API.app.removeJiraIssue(app.id, data.id, issueId);
      const { data: rData } = res.data;
      if (!rData) {
        setLoading(false);

        throw new Error('Delete failed');
      }
      await onReload();
      toast.success(t('Delete Successfully'));
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };
  return (
    <>
      {loading && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-[99999] bg-blue-gray-400/20">
          <Loading fullScreen />
        </div>
      )}
      <Dialog
        open={open}
        onOpenChange={() => {
          if (!loading) {
            onClose();
          }
        }}
        // className="!max-w-[70%] !w-full max-h-[85%] overflow-scroll"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-1">
            {data?.jiraIssues.map((issue) => {
              return (
                <div key={issue.id} className="flex justify-start">
                  <div
                    className={clsx(
                      'h-fit my-[0.2rem] p-[.3rem] flex rounded-full',
                      loading
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer hover:bg-blue-gray-200/40'
                    )}
                  >
                    <MdDelete
                      className="w-6 h-6 my-auto text-red-500"
                      onClick={() => {
                        if (loading) {
                          return;
                        }
                        onDelete(issue.id);
                      }}
                    />
                  </div>
                  <a
                    href={issue.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex justify-start px-2 py-1 my-auto text-blue-500 hover:text-blue-600"
                  >
                    <Image
                      src={issue.iconUrl}
                      className="h-fit my-[0.2rem] w-[25px h-[25px]"
                      alt={issue.summary}
                      width={25}
                      height={25}
                    />{' '}
                    <div className="flex my-auto ml-2">
                      <div className="col-span-1 text-base font-normal min-w-fit w-fit">
                        {' '}
                        {issue.issueIdOrKey}
                      </div>

                      <div className="ml-2 text-base font-normal ">
                        {issue.summary}
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JiraIssuesDialog;
