import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { SiJirasoftware } from 'react-icons/si';
import { App } from '../../app/util/type/App';
import { AppVersion } from '../../app/util/type/AppVersion';
import { MdDelete } from 'react-icons/md';

type Props = {
  title: string;
  onClose: () => void;
  open: boolean;
  app: App;
  data: AppVersion | null;
};

const JiraIssuesDialog = ({ title, onClose, open, app, data }: Props) => {
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
        <div className="grid grid-cols-1 gap-2">
          {data?.jiraIssues.map((issue) => {
            return (
              <div className="flex">
                <div className="p-2 my-auto rounded-full cursor-pointer hover:bg-blue-gray-200/40">
                  <MdDelete className="w-4 h-4 text-red-500" />
                </div>
                <a
                  href={issue.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex px-2 my-auto text-blue-500 hover:text-blue-600"
                >
                  <img src={issue.iconUrl} alt={issue.summary} />{' '}
                  <p className="ml-2">{issue.summary}</p>
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
