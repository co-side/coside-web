import { useState } from "react";
import theme from "@/styles/theme";
import { Box, Typography, Grid, useMediaQuery, useTheme } from "@mui/material"; // 引入 Grid
import Image from "next/image";
import Link from "next/link";
import { ProjectTag } from "@/components/ProjectTag";

const UserInfoProjectList = ({ creatorData }) => {
  const muiTheme = useTheme();
  const isBelowMd = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [imageSources, setImageSources] = useState(() => {
    const initialState = {};
    creatorData?.projects.forEach((project) => {
      initialState[project.id] = `https://coside-api.zeabur.app/${project.background_Path}`;
    });
    return initialState;
  });

  const handleImageError = (projectId) => {
    setImageSources((prev) => ({
      ...prev,
      [projectId]: "/banner_coside_1.png",
    }));
  };

  return (
    <Grid container rowSpacing="11px" columnSpacing="11px">
      {creatorData?.projects.map((project) => (
        <Grid item xs={12} sm={6} md={4} key={project.id}>
          <Link href={`/project/${project.id}`} target="_blank" style={{ display: "block", textDecoration: "none" }}>
            <Box
              sx={{
                cursor: "pointer",
                border: `1px solid ${theme.figma.Primary.light_gray}`,
                borderRadius: 3,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 2,
                "&:hover": {
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Image
                src={imageSources[project.id]}
                alt={project.name}
                width={500}
                height={isBelowMd ? 149 : 96}
                style={{
                  display: "block",
                  border: `1px solid ${theme.figma.Primary.light_gray}`,
                  borderRadius: "0.5rem",
                  objectFit: "cover",
                  width: "100%",
                }}
                onError={() => handleImageError(project.id)}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <ProjectTag projectTag={project.type} />
                {project.is_Creator ?
                  <Typography sx={{ color: theme.figma.project_tags.sideproject_implement, fontSize: "14px", lineHeight: "16px", mb: 0 }}>發起人</Typography>
                  :
                  <Typography sx={{ color: theme.figma.neutral[60], fontSize: "14px", lineHeight: "16px" }}>參與者</Typography>
                }
              </Box>
              <Typography
                variant="body1"
                component="h4"
                sx={{
                  marginBottom: 0,
                  fontSize: "18px",
                  fontWeight: "700",
                  lineHeight: "21px", // 控制行高
                  height: "42px", // 確保正好 2 行
                  display: "-webkit-box", // 讓 ellipsis 適用於多行
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2, // 限制最多 2 行
                  overflow: "hidden",
                  textOverflow: "ellipsis", // 必須搭配 -webkit-box 才能生效
                }}
              >
                {project.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: "12px",
                  color: `${theme.figma.neutral[60]}`,
                  marginBottom: "16px",
                }}
              >
                <span>{project.categories.join(" / ")}・{project.duration}</span>
              </Typography>
            </Box>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserInfoProjectList;
