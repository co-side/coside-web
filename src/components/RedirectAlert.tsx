import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

interface ErrorPageProps {
  themeColor: 'purple' | 'blue';
  imageSrc: string;
  imageAlt: string;
  title: React.ReactNode;
  buttons?: {
    text: string;
    onClick: () => void;
    variant: 'fill' | 'outline';
  }[];
}

function RedirectAlert({
  themeColor,
  imageSrc,
  imageAlt,
  title,
  buttons = [],
}: ErrorPageProps) {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));

  const themeColors = {
    purple: {
      text: 'rgba(191, 143, 253, 0.8)',
      colorFill: theme.figma.btn.fill.content_default,
      bgFill: theme.figma.btn.fill.bg_default_purple,
      bgFillHover: theme.figma.btn.fill.bg_hover_purple,
      colorOutline: theme.figma.Secondary.normal_purple,
      bgOutline: theme.figma.neutral[100],
      bgOutlineHover: theme.figma.Secondary.extra_light_purple,
      borderOutline: theme.figma.Secondary.normal_purple,
    },
    blue: {
      text: 'rgba(0, 125, 195, 0.5)',
      colorFill: theme.figma.btn.fill.content_default,
      bgFill: theme.figma.btn.fill.bg_default_blue,
      bgFillHover: theme.figma.btn.fill.bg_hover_blue,
      colorOutline: theme.figma.Primary.normal_blue,
      bgOutline: theme.figma.neutral[100],
      bgOutlineHover: theme.figma.Primary.extra_light_blue,
      borderOutline: theme.figma.Primary.normal_blue,
    },
  };

  const activeTheme = themeColors[themeColor] || themeColors.purple;

  return (
    <Box sx={{
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%"
    }}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={isMd ? 80 : 200}
        height={isMd ? 80 : 200}
        style={{ margin: "0 auto", display: "block" }}
      />

      <Typography sx={{
        color: activeTheme.text,
        mt: { xs: "19px", md: "32px" },
        fontSize: { xs: "16px", md: "32px" },
        lineHeight: { xs: "26px", md: "45px" },
        fontWeight: "bold",
        textAlign: "center",
      }}>
        {title}
      </Typography>

      <Box sx={{
        width: "100%",
        mt: "49px",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "center",
        gap: "16px"
      }}>
        {buttons.map((btn, idx) => (
          <Button
            key={idx}
            onClick={btn.onClick}
            variant={btn.variant === 'fill' ? 'contained' : 'outlined'}
            sx={{
              display: "block",
              fontWeight: "normal",
              boxShadow: "none",
              maxWidth: "288px",
              width: "100%",
              color: btn.variant === 'fill' ? activeTheme.colorFill : activeTheme.colorOutline,
              bgcolor: btn.variant === 'fill' ? activeTheme.bgFill : activeTheme.bgOutline,
              border: btn.variant === 'fill' ? 'none' : `1px solid ${activeTheme.borderOutline}`,
              borderRadius: "12px",
              textDecoration: "none",
              padding: btn.variant === 'fill' ? "11px 16px" : "10px 16px",
              fontSize: "16px",
              lineHeight: "19px",
              margin: { xs: "0 auto", md: 0 },
              "&:hover": {
                boxShadow: "none",
                bgcolor: btn.variant === 'fill' ? activeTheme.bgFillHover : activeTheme.bgOutlineHover,
                borderColor: btn.variant === 'fill' ? 'transparent' : activeTheme.borderOutline,
              },
            }}
          >
            {btn.text}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default RedirectAlert;
