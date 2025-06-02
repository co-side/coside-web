'use client';

import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from "@tanstack/react-query";

import { fetchPreLogin } from "@/services/auth";

import styles from "./LoginDialog.module.scss";

export const LoginDialog = ({
  open, onClose
}: { open: boolean, onClose: () => void }) => {
  const { mutateAsync: handleGoogleLogin } = useMutation({
    mutationFn: () => fetchPreLogin(),
    onSuccess: () => {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth/google`;
    }
  })

  return (
    <Dialog open={open} onClose={() => { onClose() }} disableScrollLock classes={{ paper: styles.dialog }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }} >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.figma.Primary.black
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle className={styles.center}>
        <Image src="/coside_icon.svg" alt="" width={69} height={65} className={styles.image} />
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <h3 className={styles.contentHead}>歡迎來到 Co-Side</h3>
        <p className={styles.contentText}>你尋找 Side Project 的好幫手</p>
      </DialogContent>
      <div className={styles.buttonContainer}>
        <Button
          variant="outlined"
          className={styles.loginButton}
          onClick={() => handleGoogleLogin()}
        >
          <Image src="/SSOIcon.png" alt="Google Icon" width={24} height={24} className={styles.googleIcon} />
          使用 Google 登入
        </Button>
      </div>
    </Dialog>

  );
};

