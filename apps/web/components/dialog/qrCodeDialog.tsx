import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

import { useTranslations } from "next-intl";
import QRCode from "react-qr-code";
type Props = {
  title: string;
  description?: string;
  onClose: () => void;
  open: boolean;
  qrCodeValue: string;
};

const QRCodeDialog = ({
  title,
  onClose,
  open,
  qrCodeValue,
  description,
}: Props) => {
  const t = useTranslations("Apps");
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
      }}
      // className="!max-w-[70%] !w-full max-h-[85%] overflow-scroll"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <center>
          {qrCodeValue ? (
            <QRCode
              size={256}
              style={{
                height: "auto",
                maxWidth: "300px",
                width: "100%",
              }}
              value={qrCodeValue}
              viewBox={`0 0 256 256`}
            />
          ) : (
            <Skeleton className="max-w-[300px] w-full aspect-square" />
          )}
        </center>
        <DialogFooter>
          <Button
            onClick={() => {
              onClose();
            }}
          >
            <span>{t("Done")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;
