"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Modal, Grid, Button, useMediaQuery, useTheme, Avatar as MuiAvatar } from "@mui/material";
import theme from "@/styles/theme";
import Image from "next/image";
import UserInfoProjectList from "@/components/ProjectDetail/UserInfoProjectList";
import Link from "next/link";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { userGetCreatorInfo } from "@/api/user";
import useLoginStore from "@/stores/loginStore";
interface ProjectCardModalProps {
  creatorId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectCardModal = ({ creatorId, isOpen, onClose }: ProjectCardModalProps) => {
  const muiTheme = useTheme();
  const isBelowMd = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [creatorData, setCreatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = useLoginStore.getState().userInfo;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await userGetCreatorInfo(creatorId);
        if (data.success) {
          setCreatorData(data.data);
          console.log(data.data)
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (creatorId) {
      fetchData();
    }
  }, [creatorId]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="project-modal"
      aria-describedby="project-details"
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.3)", // 這裡設定背景色，黑色透明 50%
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: 820,
          width: "calc(100% - 40px)",
          maxHeight: "calc(100% - 88px)",
          bgcolor: theme.figma.neutral[100],
          borderRadius: "12px",
          boxShadow: 24,
          overflow: "hidden",
          outline: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto", // 啟用滾動
          }}
        >
          <Box
            sx={{
              background: `
            linear-gradient(
              to bottom right,
              rgba(109, 80, 242, 0.5) 0%,
              rgba(186, 89, 235, 0.5) 50%,
              rgba(232, 107, 233, 0.5) 100%
            )`,
              height: isBelowMd ? "93px" : "135px",
              position: "relative",
            }}
          >
            {(!loading && creatorData) &&
              <>
                {creatorData.avatar ? (
                  <MuiAvatar
                    src={`https://coside-api.zeabur.app/${creatorData.avatar}`}
                    alt={creatorData.name}
                    sx={{
                      marginRight: "0.75rem",
                      position: "absolute",
                      bottom: "0",
                      left: isBelowMd ? "50%" : "48px",
                      transform: isBelowMd
                        ? "translate(-50%, 50%)"
                        : "translateY(50%)",
                      outline: "4px solid #fff",
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      width: isBelowMd ? 86 : 110,
                      height: isBelowMd ? 86 : 110
                    }}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null; // 防止無限觸發
                      target.src = ""; // 清空圖片，讓 fallback 出現
                    }}
                  />
                ) : (
                  <MuiAvatar
                    sx={{
                      marginRight: "0.75rem",
                      position: "absolute",
                      bottom: "0",
                      left: isBelowMd ? "50%" : "48px",
                      transform: isBelowMd
                        ? "translate(-50%, 50%)"
                        : "translateY(50%)",
                      outline: "4px solid #fff",
                      borderRadius: "50%",
                      bgcolor: theme.figma.neutral[90],
                      color: "#656565",
                      width: isBelowMd ? 86 : 110,
                      height: isBelowMd ? 86 : 110,
                      fontSize: "32px",
                      lineHeight: "42px",
                      fontWeight: "bold",
                    }}
                  >
                    {creatorData.name.charAt(0).toUpperCase()}
                  </MuiAvatar>
                )}
              </>
            }
            <Box
              onClick={onClose}
              sx={{
                cursor: "pointer",
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "24px",
                height: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
              }}
            >
              ✕
            </Box>
          </Box>
          {loading || !creatorData ?
            <Box sx={{ padding: "40px", textAlign: "center" }}>
              <Typography variant="body1">載入中...</Typography>
            </Box>
            :
            <Box
              sx={{
                pl: isBelowMd ? "16px" : "48px",
                pr: isBelowMd ? "16px" : "48px",
              }}
            >
              <Grid
                container
                sx={{
                  alignItems: "center",
                  pt: isBelowMd ? "60px" : "18px",
                  pb: "20px",
                  minHeight: "200px",
                }}
                rowSpacing="26px"
                columnSpacing="49px"
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  sx={{
                    textAlign: isBelowMd ? "center" : "left",
                    mt: isBelowMd ? "0" : "42px",
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      marginBottom: "12px",
                      fontSize: "24px",
                      lineHeight: "29px",
                      fontWeight: "bold",
                    }}
                  >
                    {creatorData.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.figma.profession_tags.outline_uiux,
                      fontSize: "14px",
                      lineHeight: "17px",
                      fontWeight: "bold",
                      mb: "20px",
                    }}
                  >
                    {creatorData.role}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: isBelowMd ? "center" : "flex-start",
                      gap: 2,
                    }}
                  >
                    {creatorData.email &&
                      <Link href={`mailto:${creatorData.email}`}>
                        <Image
                          src="/email.svg"
                          alt="email"
                          width={24}
                          height={24}
                          style={{ display: "block" }}
                        />
                      </Link>
                    }
                    {(creatorData.is_Instagram_Public && creatorData.instagram) &&
                      <Link href={creatorData.instagram} target="_blank">
                        <Image
                          src="/instagram.svg"
                          alt="instagram"
                          width={24}
                          height={24}
                          style={{ display: "block" }}
                        />
                      </Link>
                    }
                    {(creatorData.is_Facebook_Public && creatorData.facebook) &&
                      <Link href={creatorData.facebook} target="_blank">
                        <Image
                          src="/facebook.svg"
                          alt="facebook"
                          width={24}
                          height={24}
                          style={{ display: "block" }}
                        />
                      </Link>
                    }
                    {creatorData.link &&
                      <Link href={creatorData.link} target="_blank">
                        <Image
                          src="/website.svg"
                          alt="website"
                          width={24}
                          height={24}
                          style={{ display: "block" }}
                        />
                      </Link>
                    }
                  </Box>
                  {(userInfo && userInfo.id === creatorData.id) &&
                    <Button
                      component="a"
                      href="/profile"
                      target="_blank"
                      color="primary"
                      variant="contained"
                      sx={{
                        width: "100%",
                        mt: "20px",
                        display: isBelowMd ? "none" : "flex",
                        color: theme.figma.Primary.white,
                        bgcolor: theme.figma.Primary.normal_blue,
                        borderRadius: "12px",
                        textDecoration: "none",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        gap: "8px",
                        "&:hover": {
                          bgcolor: theme.figma.btn.fill.bg_hover_blue,
                        },
                      }}
                    >
                      <EditOutlinedIcon
                        sx={{
                          fontSize: "20px",
                          lineHeight: "20px",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        編輯個人檔案
                      </Typography>
                    </Button>
                  }
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={8}
                  sx={{
                    textAlign: isBelowMd ? "center" : "left",
                  }}
                >
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      display: "inline-block",
                      fontSize: "14px",
                      lineHeight: "17px",
                      padding: "6px 12px",
                      marginBottom: "13px",
                      borderRadius: "100px",

                      bgcolor: theme.figma.Primary.light_gray,
                      color: theme.figma.neutral[50],
                    }}
                  >
                    參與專案 {creatorData.projects.length}
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      padding: 2,
                      backgroundColor: "#F1F7FF",
                      borderRadius: "12px",
                      minHeight: "158px",
                      mb: 0,
                      textAlign: "left",
                    }}
                  >
                    {creatorData.intro}
                  </Typography>
                </Grid>
                {(userInfo && userInfo.id === creatorData.id) &&

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    sx={{
                      display: isBelowMd ? "block" : "none",
                      mb: "10px",
                    }}
                  >
                    <Button
                      component="a"
                      href="/profile"
                      target="_blank"
                      color="primary"
                      variant="contained"
                      sx={{
                        color: theme.figma.Primary.white,
                        bgcolor: theme.figma.Primary.normal_blue,
                        borderRadius: "12px",
                        textDecoration: "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        gap: "8px",
                        "&:hover": {
                          bgcolor: theme.figma.btn.fill.bg_hover_blue,
                        },
                      }}
                    >
                      <EditOutlinedIcon
                        sx={{
                          fontSize: "20px",
                          lineHeight: "20px",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        編輯個人檔案
                      </Typography>
                    </Button>
                  </Grid>
                }
              </Grid>
              <Box
                sx={{
                  pt: "32px",
                  pb: "48px",
                }}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    color: theme.figma.Primary.dark_gray,
                    marginBottom: 1.5,
                    fontWeight: "bold",
                    fontSize: "20px",
                    lineHeight: "24px",
                  }}
                >
                  參與專案
                </Typography>
                <UserInfoProjectList creatorData={creatorData} />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </Modal>
  );
};

export default ProjectCardModal;
