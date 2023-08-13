import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Button,
} from '@material-tailwind/react';
import QRCode from 'react-qr-code';

type Props = {
  title: string;
  onClose: () => void;
  open: boolean;
  qrCodeValue: string;
};

const QRCodeDialog = ({ title, onClose, open, qrCodeValue }: Props) => {
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
        <center>
          <QRCode
            size={256}
            style={{
              height: 'auto',
              maxWidth: '520px',
              width: '100%',
            }}
            value={qrCodeValue}
            viewBox={`0 0 256 256`}
          />
        </center>
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

export default QRCodeDialog;
