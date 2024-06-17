import { Box, Typography } from "@mui/material";
import Image from "next/image";

const TEXT_MAP: Record<string, string> = {
  EXPLORE: "探索新專案",
  MY_PROJECTS: "我的專案",
};

export const Topbar = () => {
  return (
    <Box
      sx={{
        height: "80px",
        width: "100%",
        padding: "0 11%",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        backgroundColor: "#FFFFFF",
        zIndex: 10,
      }}
    >
      <Image src="/theme-logo.svg" alt="Co-Side" width={174} height={40} />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography>{TEXT_MAP.EXPLORE}</Typography>
        <Typography sx={{ marginLeft: "48px" }}>
          {TEXT_MAP.MY_PROJECTS}
        </Typography>
        <Box
          sx={{
            height: "60px",
            width: "60px",
            marginLeft: "48px",
            borderRadius: "50%",
            backgroundColor: "#ECECEC",
          }}
        ></Box>
      </Box>
    </Box>
  );
};
