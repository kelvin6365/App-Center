import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from '@material-tailwind/react';
import CodeBlock from '../CodeBlock/CodeBlock';
import { App } from '../../app/util/type/App';
import { useState } from 'react';

type Props = {
  title: string;
  onClose: () => void;
  open: boolean;
  app: App;
};

const PostmanDialog = ({ title, onClose, open, app }: Props) => {
  const [name, setName] = useState('APP_VERSION_NAME');
  const [description, setDescription] = useState('APP_VERSION_DESCRIPTION');
  const [installPassword, setInstallPassword] = useState('INSTALL_PASSWORD');
  const [tags, setTags] = useState('Tag1,Tag2,Tag3');
  const [filePath, setFilePath] = useState('/PATH-TO-FILE/FILE.{ipa/apk}');
  const reset = () => {
    setName('APP_VERSION_NAME');
    setDescription('APP_VERSION_DESCRIPTION');
    setInstallPassword('INSTALL_PASSWORD');
    setTags('Tag1,Tag2,Tag3');
    setFilePath('/PATH-TO-FILE/FILE.{ipa/apk}');
  };
  return (
    <Dialog
      open={open}
      handler={() => {
        onClose();
        reset();
      }}
      className="!max-w-[70%] !w-full max-h-[85%] overflow-scroll"
    >
      <DialogHeader>{title}</DialogHeader>
      <DialogBody divider>
        <div className="grid grid-cols-2 gap-4 py-2">
          <Input
            label="Version Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            defaultValue={name}
            autoFocus={false}
          />
          <Input
            label="Description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            defaultValue={description}
            autoFocus={false}
          />
          <Input
            label="Install Password"
            onChange={(e) => {
              setInstallPassword(e.target.value);
            }}
            defaultValue={installPassword}
            autoFocus={false}
          />
          <Input
            label="Version Tags"
            onChange={(e) => {
              setTags(e.target.value);
            }}
            defaultValue={tags}
            autoFocus={false}
          />
          <Input
            label="File Path"
            onChange={(e) => {
              setFilePath(e.target.value);
            }}
            defaultValue={filePath}
            autoFocus={false}
          />
        </div>
        <div className="py-1 text-base font-bold text-black">cURL</div>
        <CodeBlock
          // eslint-disable-line
          text={`curl --location '${
            import.meta.env.VITE_ENV === 'local'
              ? 'http://localhost:9000' + import.meta.env.VITE_API_HOST
              : import.meta.env.VITE_API_HOST
          }/v1/app/${app.id}/versions'  \\
  --form 'name="${name}"'  \\
  --form 'description="${description}"'  \\
  --form 'file=@"${filePath}"'  \\
  --form 'apiKey="${app?.apiKey}"'  \\
  --form 'tags="${tags}"'  \\
  --form 'installPassword="${installPassword}"'`}
          language={'bash'}
        />
      </DialogBody>
      <DialogFooter>
        {/* <Button
          variant="text"
          color="red"
          onClick={() => onClose()}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button> */}
        <Button
          variant="gradient"
          onClick={() => {
            onClose();
            reset();
          }}
        >
          <span>Done</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default PostmanDialog;
