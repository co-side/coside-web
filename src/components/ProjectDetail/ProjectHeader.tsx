"use client";

import { useState } from "react";
import theme from "@/styles/theme";
import { Box, Typography, useMediaQuery, useTheme, Avatar as MuiAvatar } from "@mui/material";
import Image from "next/image";
import { CharacterTag } from "@/components/CharacterTag";
import { ProjectTag } from "@/components/ProjectTag";

const TEXT_MAP: Record<string, string> = {
  REQUIRE_TYPE: "專案類型",
  REQUIRE_DURATION: "預計時長",
  SPONSOR: "發起人",
};

export default function ProjectHeader({
  project,
  handleOpenModal,
  groupedMembers,
}) {
  const muiTheme = useTheme();
  const isBelowMd = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [imgSrc, setImgSrc] = useState(`https://coside-api.zeabur.app/${project.background_Path}`);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: {
            xs: "217px", sm: "217px", md: "449px",
          },
        }}
      >
        <Image
          src={imgSrc}
          alt={project.name}
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
            borderRadius: "12px",
            border: `1px solid ${theme.figma.neutral[80]}`,
          }}
          onError={() => {
            setImgSrc("/banner_coside_1.png");
          }}
          priority
        />
      </Box>
      <Box
        sx={{
          padding: { xs: 0, sm: 0, md: 5 },
          border: {
            xs: "none",
            sm: "none",
            md: `1px solid ${theme.palette.grey[200]}`,
          },
          borderRadius: "20px",
          display: { xs: "block", sm: "block", md: "flex" },
          justifyContent: "space-between",
          alignItems: "top",
          gap: 2.5,
          mt: 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: { xs: "flex", sm: "flex", md: "none" },
            alignItems: "center",
            cursor: "pointer",
            mb: 1.5,
          }}
          onClick={handleOpenModal}
        >
          <Box
            sx={{
              height: "32px",
              width: "32px",
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px",
              backgroundColor: theme.figma.neutral[100],
            }}
          >
            {project.creator.avatar ? (
              <MuiAvatar
                src={`https://coside-api.zeabur.app/${project.creator.avatar}`}
                alt={project.creator.name}
                sx={{ width: 32, height: 32 }}
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
                  width: 32,
                  height: 32,
                  fontSize: "16px",
                  lineHeight: "19px",
                  fontWeight: "bold",
                }}
              >
                {project.creator.name.charAt(0).toUpperCase()}
              </MuiAvatar>
            )}
          </Box>
          <Typography sx={{ color: theme.figma.neutral[50], fontSize: "16px", lineHeight: "19px" }}>
            {project.creator.name}
          </Typography>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: {
              xs: "column-reverse",
              sm: "column-reverse",
              md: "column",
            },
            gap: { xs: 1.5, sm: 1.5, md: 2.5 },
            width: { xs: "100%", sm: "100%", md: "50%" },
            mb: { xs: 1.5, sm: 1.5, md: 0 },
          }}
        >
          <ProjectTag projectTag={project.type} />
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: "bold",
              fontSize: "36px", // 預設值
              lineHeight: "42px",
              height: "84px", // 2 行高度 = lineHeight * 2
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              [theme.breakpoints.down("md")]: {
                fontSize: "24px",
                lineHeight: "27px",
                height: "54px",
              },
            }}
          >
            {project.name}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column-reverse",
              sm: "column-reverse",
              md: "column",
            },
            width: { xs: "100%", sm: "100%", md: "50%" },
            gap: {
              xs: "12px",
              sm: "12px",
              md: 0,
            },
          }}
        >
          <Box
            sx={{
              [theme.breakpoints.down("md")]: {
                padding: "20px",
                backgroundColor: theme.figma.neutral[100],
                border: `1px solid ${theme.figma.neutral[80]}`,
                borderRadius: "12px",
              },
            }}
          >
            <Typography
              sx={{
                display: { xs: "block", sm: "block", md: "none" },
                fontSize: "16px",
                lineHeight: "19px",
                color: theme.figma.neutral[30],
                fontWeight: "bold",
                mb: "14px",
              }}
            >
              徵求
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              {groupedMembers.length > 0 ? <>
                {groupedMembers.map((member, index) => (
                  <CharacterTag
                    key={`member-${member.role}-${index}`}
                    character={member.role}
                    type={isBelowMd ? "square" : "detailInfo"}
                    addText={isBelowMd ? `${member.count}名` : ""}
                  />
                ))
                }
              </> :
                <Typography sx={{
                  display: { xs: "block", md: "none" },
                  fontSize: "16px",
                  lineHeight: "19px",
                  color: theme.figma.form.placeholder_input,
                  fontWeight: "bold"
                }}>暫無缺額</Typography>
              }
            </Box>
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: { xs: 0, sm: 0, md: 2 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "16px", md: "20px" },
                  lineHeight: "26px",
                  color: { xs: theme.figma.neutral[30], md: theme.figma.Primary.dark_gray },
                  fontWeight: { xs: "bold", md: "normal" },
                  marginRight: { xs: "16px", md: "6px" },
                }}
              >
                {TEXT_MAP.REQUIRE_TYPE}
              </Typography>
              <Typography
                sx={{
                  display: { xs: "none", sm: "none", md: "block" },
                  fontSize: { xs: "16px", md: "20px" },
                  lineHeight: "26px",
                  color: { xs: theme.figma.neutral[30], md: theme.figma.Primary.dark_gray },
                  fontWeight: { xs: "bold", md: "normal" },
                }}
              >
                ｜
              </Typography>
              <Typography sx={{
                fontSize: { xs: "16px", md: "20px" },
                lineHeight: "26px",
                color: { xs: theme.figma.neutral[30], md: theme.figma.Primary.dark_gray },
                fontWeight: "bold",
              }}>
                {project.categories.map((category) => category).join(" / ")}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", marginTop: { xs: "8px", md: "16px" } }}>
              <Typography
                sx={{
                  fontSize: { xs: "16px", md: "20px" },
                  lineHeight: "26px",
                  color: { xs: theme.figma.neutral[30], md: theme.figma.Primary.dark_gray },
                  fontWeight: { xs: "bold", md: "normal" },
                  marginRight: { xs: "16px", md: "6px" },
                }}
              >
                {TEXT_MAP.REQUIRE_DURATION}
              </Typography>
              <Typography
                sx={{
                  display: { xs: "none", sm: "none", md: "block" },
                  fontSize: { xs: "16px", md: "20px" },
                  lineHeight: "26px",
                  color: { xs: theme.figma.neutral[30], md: theme.figma.Primary.dark_gray },
                  fontWeight: { xs: "bold", md: "normal" },
                }}
              >
                ｜
              </Typography>
              <Typography sx={{
                fontSize: { xs: "16px", md: "20px" },
                lineHeight: "26px",
                color: { xs: theme.figma.neutral[30], md: theme.figma.Primary.dark_gray },
                fontWeight: "bold",
              }}>
                {project.duration}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "flex" },
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                lineHeight: "26px",
                color: theme.figma.Primary.dark_gray,
                marginRight: "6px",
                letterSpacing: "0.5em",
                textWrap: "nowrap",
                maxWidth: "4em",
              }}
            >
              {TEXT_MAP.SPONSOR}
            </Typography>
            <Typography
              sx={{
                fontSize: "20px",
                lineHeight: "26px",
                color: theme.figma.Primary.dark_gray,
                mr: "4px"
              }}
            >
              ｜
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleOpenModal}
            >
              <Box
                sx={{
                  height: "24px",
                  width: "24px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                }}
              >
                {project.creator.avatar ? (
                  <MuiAvatar
                    src={`https://coside-api.zeabur.app/${project.creator.avatar}`}
                    alt={project.creator.name}
                    sx={{ width: 24, height: 24 }}
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
                      width: 24,
                      height: 24,
                      fontSize: "14px",
                      lineHeight: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    {project.creator.name.charAt(0).toUpperCase()}
                  </MuiAvatar>
                )}
              </Box>
              <Typography sx={{
                fontSize: "20px",
                lineHeight: "26px",
                color: theme.figma.Primary.dark_gray,
                fontWeight: "bold"
              }}>
                {project.creator.name}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
