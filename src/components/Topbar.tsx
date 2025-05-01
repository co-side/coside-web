"use client";

import React, { useState, useRef } from "react";
import theme from "@/styles/theme";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Container,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton
} from "@mui/material";
import AnimatedHamburger from "./AnimatedHamburger";
import { usePathname } from "next/navigation";

const Avatar = dynamic(() => import("./Avatar"), { ssr: false });

export const Topbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const containerRef = useRef(null);
  const pathname = usePathname();

  const handleCloseDrawer = () => setOpenDrawer(false);
  const handleToggleDrawer = () => setOpenDrawer(!openDrawer);

  const navItems = [
    { label: "探索新專案", href: "/" },
    { label: "關於Co-Side", href: "/about" },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
        zIndex: 10,
        pl: "4%",
        pr: "4%",
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: "1224px", pl: "0 !important", pr: "0 !important" }}>
        <Toolbar disableGutters sx={{ py: 2 }} ref={containerRef}>
          {/* Logo - desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
            <Link href="/" passHref>
              <Image src="/theme-logo.svg" alt="Co-Side" width={174} height={40} priority />
            </Link>
          </Box>

          {/* Mobile menu burger */}
          <Box sx={{ display: { xs: "flex", md: "none" }, position: "relative", zIndex: 9999 }}>
            <IconButton
              aria-label="navigation menu"
              onClick={handleToggleDrawer}
              sx={{ p: 0, position: "relative" }}
            >
              <AnimatedHamburger isOpen={openDrawer} toggle={() => setOpenDrawer(!openDrawer)} />
            </IconButton>

            <Drawer
              anchor="top"
              open={openDrawer}
              onClose={handleCloseDrawer}
              disableScrollLock
              container={containerRef.current} 
              slotProps={{
                backdrop: {
                  invisible: true,
                },
              }}
              PaperProps={{
                sx: {
                  width: "100%",
                  height: "auto",
                  maxHeight: "100vh",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  backgroundColor: theme.figma.Primary.white,
                  padding: "16px",
                },
              }}
            >
              {/* 關閉按鈕 */}
              {/* <Image
                onClick={handleCloseDrawer}
                src="/mobile_menu_close.svg"
                alt="close"
                width={48}
                height={48}
                style={{
                  cursor: "pointer",
                }}
              /> */}

              <hr
                style={{
                  border: "none",
                  borderTop: `1px solid ${theme.figma.neutral[80]}`,
                  margin: "64px 0 16px",
                }}
              />

              {/* 導覽列表 */}
              <List>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} passHref>
                    <ListItem disablePadding onClick={handleCloseDrawer}>
                      <ListItemButton
                        sx={{
                          justifyContent: "center",
                          padding: "20px",
                        }}
                      >
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            textAlign: "center",
                            fontSize: "20px",
                            lineHeight: "23px",
                            color:
                              pathname === item.href
                                ? theme.figma.Primary.normal_blue
                                : theme.figma.Primary.black,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                ))}
              </List>
            </Drawer>

          </Box>

          {/* Logo - mobile (centered) */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: { xs: "flex", md: "none" }
            }}
          >
            <Link href="/" passHref>
              <Image src="/coside_icon_mobile.svg" alt="Co-Side" width={42} height={39} priority />
            </Link>
          </Box>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: "48px", justifyContent: "flex-end" }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  disableRipple
                  sx={{
                    textTransform: 'none',
                    position: "relative",
                    color:
                      pathname === item.href
                        ? theme.figma.Primary.normal_blue
                        : theme.figma.Primary.black,
                    fontSize: "20px",
                    lineHeight: "23px",
                    p: 0,
                    backgroundColor: "transparent",
                    "&:hover": {
                      color: theme.figma.Primary.normal_blue,
                      backgroundColor: "transparent",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "block",
                      width: pathname === item.href ? "60%" : 0,
                      height: "2px",
                      backgroundColor: theme.figma.Primary.normal_blue,
                      marginTop: "4px",
                      transition: "width 0.3s ease-in-out",
                    },
                    "&:hover::after": {
                      width: "60%",
                    },
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>

          {/* Avatar */}
          <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "flex" }, ml: "auto" }}>
              <Avatar />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};