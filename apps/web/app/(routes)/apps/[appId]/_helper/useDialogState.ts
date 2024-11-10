import { AppVersion } from "@/types/AppVersion";
import { useState } from "react";

const useDialogState = () => {
  const [openPostman, setOpenPostman] = useState(false);
  const [openQRCode, setOpenQRCode] = useState({
    open: false,
    data: "",
  });
  const [openGitLab, setOpenGitLab] = useState(false);
  const [openEditApp, setOpenEditApp] = useState(false);
  const [openUploadVersion, setOpenUploadVersion] = useState(false);
  const [openShareInstallURL, setOpenShareInstallURL] = useState<{
    open: boolean;
    data: AppVersion | null;
  }>({
    open: false,
    data: null,
  });
  const [openJira, setOpenJira] = useState(false);
  const [openJiraIssues, setOpenJiraIssues] = useState<{
    open: boolean;
    data: AppVersion | null;
  }>({
    open: false,
    data: null,
  });
  const [openUserAppPermissions, setOpenUserAppPermissions] = useState(false);

  return {
    openPostman,
    setOpenPostman,
    openQRCode,
    setOpenQRCode,
    openGitLab,
    setOpenGitLab,
    openEditApp,
    setOpenEditApp,
    openUploadVersion,
    setOpenUploadVersion,
    openShareInstallURL,
    setOpenShareInstallURL,
    openJira,
    setOpenJira,
    openJiraIssues,
    setOpenJiraIssues,
    openUserAppPermissions,
    setOpenUserAppPermissions,
  };
};

export default useDialogState;
