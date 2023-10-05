import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { SiJirasoftware } from 'react-icons/si';
import { App } from '../../app/util/type/App';
import { AppVersion } from '../../app/util/type/AppVersion';
import { MdDelete } from 'react-icons/md';
import API from '../../app/util/api';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import clsx from 'clsx';

type Props = {
  title: string;
  onClose: () => void;
  onReload: () => void;
  open: boolean;
  app: App;
  data: AppVersion;
};

const JiraIssuesDialog = ({
  title,
  onClose,
  onReload,
  open,
  app,
  data,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const onDelete = async (issueId: string) => {
    try {
      setLoading(true);
      const res = await API.app.removeJiraIssue(app.id, data.id, issueId);
      const { data: rData } = res.data;
      if (!rData) {
        setLoading(false);

        throw new Error('Delete failed');
      }
      setLoading(false);
      onReload();
      toast.success('Delete successfully');
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };
  return (
    <Dialog
      open={open}
      handler={() => {
        onClose();
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
        <div className="grid grid-cols-1 gap-1">
          {data?.jiraIssues.map((issue) => {
            return (
              <div className="flex justify-start">
                <div
                  className={clsx(
                    'h-fit my-[0.2rem] p-[.3rem] flex rounded-full',
                    loading
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer hover:bg-blue-gray-200/40'
                  )}
                >
                  <MdDelete
                    className="w-4 h-4 my-auto text-red-500"
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
                  <img
                    src={issue.iconUrl}
                    className="h-fit my-[0.2rem]"
                    alt={issue.summary}
                  />{' '}
                  <p className="flex my-auto ml-2">
                    <div className="col-span-1 text-base font-normal min-w-fit w-fit">
                      {' '}
                      {issue.issueIdOrKey}
                    </div>

                    <div className="ml-2 text-base font-normal ">
                      {issue.summary}
                    </div>
                  </p>
                </a>
              </div>
            );
          })}
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default JiraIssuesDialog;
