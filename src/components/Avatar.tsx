"use client";

import { useState } from "react";
import {
  Avatar as MuiAvatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  Drawer,
  useMediaQuery
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLoginDialog } from "@/contexts/LoginDialogContext"; // 開啟登入 dialog
import { LoginDialog } from "@/components/Dialog/LoginDialog"; // 登入 dialog
import theme from "@/styles/theme";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import WebOutlinedIcon from '@mui/icons-material/WebOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useGetUserQuery } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { API_SERVER_URL } from "@/constant";

const Avatar = () => {
  const { isLogin ,fetchLogout } = useAuth();
  const { data: userInfoResponse } = useGetUserQuery()
  
  const userInfo = userInfoResponse?.data;

  const { openState, closeDialog, openDialog } = useLoginDialog(); // 呼叫登入對話框
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:900px)');

  // 選單狀態
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setDrawerOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  const { mutate: handleLogout } = useMutation({
    mutationFn: fetchLogout,
    onSuccess: () => {
      closeDialog();
      router.replace('/');
    },
  })

  if (!isLogin) {
    return (
      <>
        <MuiAvatar onClick={openDialog} sx={{ marginLeft: "48px", cursor: "pointer", bgcolor: theme.figma.neutral[90], color: "#656565", width: 48, height: 48, fontSize: "14px", lineHeight: "22px" }}>
          登入
        </MuiAvatar>
        <LoginDialog open={openState} onClose={closeDialog} />
      </>
    );
  }

  // 個人資料區塊
  const userProfileBlock = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: isMobile ? "16px 8px" : "0 8px",
        gap: "20px",
      }}
    >
      {userInfo?.avatar ? (
        <MuiAvatar
          src={`${API_SERVER_URL}/${userInfo.avatar}`}
          alt={userInfo.name}
          sx={{ width: isMobile ? 60 : 76, height: isMobile ? 60 : 76 }}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.onerror = null; // 防止無限觸發
            target.src = ""; // 清空圖片，讓 fallback 出現
          }}
        />
      ) : (
        <MuiAvatar
          sx={{
            bgcolor: theme.figma.neutral[90],
            color: "#656565",
            width: isMobile ? 60 : 76,
            height: isMobile ? 60 : 76,
            fontSize: "32px",
            lineHeight: "42px",
            fontWeight: "bold",
          }}
        >
          {userInfo?.name?.charAt(0).toUpperCase()}
        </MuiAvatar>
      )}

      <Box>
        <Typography variant="subtitle1" sx={{
          fontSize: "24px",
          lineHeight: "28px",
          fontWeight: "bold",
          color: theme.figma.neutral[30],
          mb: "12px"
        }}>
          {userInfo?.name}
        </Typography>
        <Typography variant="body2" sx={{
          fontSize: "16px",
          lineHeight: "19px",
          color: theme.figma.neutral[30],
        }}>
          {userInfo?.email}
        </Typography>
      </Box>
    </Box>
  );

  const menuItems = [
    <MenuItem onClick={() => { router.push("/profile"); handleClose(); }} sx={{
      borderRadius: "12px",
      color: theme.figma.Primary.black,
      padding: "12px",
      marginBottom: "4px",
      transition: "background-color 0.3s, color 0.3s",
      "&:hover": {
        color: theme.figma.Primary.normal_blue,
        backgroundColor: theme.figma.Primary.extra_light_blue,
      }
    }} key="profile">
      <AccountCircleOutlinedIcon sx={{
        width: "24px",
        height: "24px",
        marginRight: "10px",
      }} />個人資料
    </MenuItem>,
    <MenuItem onClick={() => { router.push("/project/own"); handleClose(); }} sx={{
      borderRadius: "12px",
      color: theme.figma.Primary.black,
      padding: "12px",
      marginBottom: "4px",
      transition: "background-color 0.3s, color 0.3s",
      "&:hover": {
        color: theme.figma.Primary.normal_blue,
        backgroundColor: theme.figma.Primary.extra_light_blue,
      }
    }} key="own-projects">
      <WebOutlinedIcon sx={{
        width: "24px",
        height: "24px",
        marginRight: "10px",
      }} />我的專案
    </MenuItem>,
    <MenuItem onClick={() => handleLogout()} sx={{
      borderRadius: "12px",
      color: theme.figma.status.darker_red,
      padding: "12px",
      transition: "background-color 0.3s, color 0.3s",
      "&:hover": {
        backgroundColor: "#FFEDED",
      },
    }} key="logout">
      <LogoutOutlinedIcon sx={{
        width: "24px",
        height: "24px",
        marginRight: "10px",
      }} />登出
    </MenuItem>
  ];

  // 頁尾連結
  const footerLinks = (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
      color: theme.figma.neutral[50],
      fontSize: "16px",
      lineHeight: "19px",
    }}>
      <Link href="/service" onClick={handleClose}>服務條款</Link>
      <span>•</span>
      <Link href="/privacy" onClick={handleClose}>隱私權政策</Link>
    </Box>
  );

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ marginLeft: "48px", cursor: "pointer" }} onClick={handleClick}>
        {userInfo?.avatar ? (
          <MuiAvatar
            src={`${API_SERVER_URL}/${userInfo.avatar}`}
            alt={userInfo.name}
            sx={{ width: 48, height: 48 }}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null; // 防止無限觸發
              target.src = ""; // 清空圖片，讓 fallback 出現
            }}
          />
        ) : (
          <MuiAvatar
            sx={{
              bgcolor: theme.figma.neutral[90],
              color: "#656565",
              width: 48,
              height: 48,
              fontSize: "32px",
              lineHeight: "42px",
              fontWeight: "bold",
            }}
          >
            {userInfo?.name?.charAt(0).toUpperCase()}
          </MuiAvatar>
        )}
      </Box>

      {/* 桌面版 Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen && !isMobile}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        disableScrollLock={true}
        marginThreshold={0}
        slotProps={{
          paper: {
            sx: {
              mt: '26px', // Move the menu 26px below the avatar
              borderRadius: "20px",
              bgColor: theme.figma.Primary.white,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              padding: "24px",
              minWidth: "220px",
            },
          },
        }}
        sx={{
          '& .MuiMenu-list': {
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
      >
        {userProfileBlock}
        <hr style={{
          border: "none",
          borderTop: `1px solid ${theme.figma.neutral[80]}`,
          margin: "24px 0",
        }} />
        {menuItems}
        <hr style={{
          border: "none",
          borderTop: `1px solid ${theme.figma.neutral[80]}`,
          margin: "24px 0",
        }} />
        {footerLinks}
      </Menu>

      {/* 手機版 Drawer */}
      <Drawer
        anchor="top"
        open={drawerOpen && isMobile}
        onClose={handleClose}
        disableScrollLock
        slotProps={{
          backdrop: {
            invisible: true,
          },
        }}
        PaperProps={{
          sx: {
            width: '100%',
            height: 'auto',
            maxHeight: '100vh',
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: theme.figma.Primary.white,
            padding: "16px",
          },
        }}
      >
        <Image
          onClick={handleClose}
          src="/mobile_menu_close.svg"
          alt="close"
          width={48}
          height={48}
          style={{
            cursor: "pointer",
            marginLeft: "auto",
          }}
        />

        <hr style={{
          border: "none",
          borderTop: `1px solid ${theme.figma.neutral[80]}`,
          margin: "16px 0",
        }} />

        <Box sx={{
          padding: "4px 16px 20px",
        }}>
          {userProfileBlock}

          <hr style={{
            border: "none",
            borderTop: `1px solid ${theme.figma.neutral[80]}`,
            margin: "8px 0 24px",
          }} />

          <Box sx={{ padding: "0 8px" }}>
            {menuItems}
          </Box>

          <hr style={{
            border: "none",
            borderTop: `1px solid ${theme.figma.neutral[80]}`,
            margin: "24px 0",
          }} />

          {footerLinks}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Avatar;