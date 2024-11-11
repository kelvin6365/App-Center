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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="p-6 flex flex-col items-center space-y-4 bg-white rounded-lg border">
          {qrCodeValue ? (
            <>
              <QRCode
                size={256}
                style={{
                  height: "auto",
                  maxWidth: "256px",
                  width: "100%",
                }}
                value={qrCodeValue}
                viewBox={`0 0 256 256`}
              />
              <p className="text-sm text-muted-foreground text-center">
                {t("Scan this QR code to install this app")}
              </p>
            </>
          ) : (
            <Skeleton className="h-64 w-64" />
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onClose()}>{t("Done")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;
