import { useEffect, useState, useRef } from "react";
import theme from "@/styles/theme";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Avatar as MuiAvatar,
} from "@mui/material";
import Link from "next/link";

import { ProjectTag } from "./ProjectTag";
import { CharacterTag } from "./CharacterTag";
import { API_SERVER_URL } from "@/constant";
import { ProjectModel } from "@/services/project/getProjects";
import { useGetUserQuery } from "@/services";

const TEXT_MAP: Record<string, string> = {
  REQUIRE_POSITION: "徵求｜",
  REQUIRE_TYPE: "類型｜",
  REQUIRE_DURATION: "時長｜",
};

const VisibleCharacterTags = ({ roles }: { roles: string[] }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [visibleTags, setVisibleTags] = useState<string[]>([]);

  useEffect(() => {
    const container = boxRef.current;
    if (!container) return;

    const updateVisibleTags = () => {
      const tagElements = Array.from(container.children) as HTMLDivElement[];

      let lineCount = 1;
      let lastTop = tagElements[0]?.offsetTop ?? 0;
      let fitTags: string[] = [];

      for (let i = 0; i < tagElements.length; i++) {
        const el = tagElements[i];
        const tagTop = el.offsetTop;

        if (tagTop > lastTop) {
          lineCount++;
          lastTop = tagTop;
        }

        if (lineCount > 2) break;
        fitTags.push(roles[i]);
      }

      setVisibleTags(fitTags);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateVisibleTags();
    });

    resizeObserver.observe(container);

    // ⏱ 延遲初始執行，讓 tags 真實渲染完
    const timeoutId = setTimeout(updateVisibleTags, 100);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [roles]);

  return (
    <Box
      ref={boxRef}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        maxHeight: "64px",
        overflow: "hidden",
      }}
    >
      {visibleTags.map((tag, index) => (
        <CharacterTag key={`${tag}-${index}`} character={tag} data-character-tag />
      ))}
      {roles.length > 0 && visibleTags.length < roles.length && (
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            height: "26px",
            marginLeft: "4px",
          }}
        >
          ...
        </Box>
      )}
    </Box>
  );
};

interface ProjectCardProps {
  project: ProjectModel;
  variant?: 'own' | 'homePage';
}

export const ProjectCard = ({
  project,
  variant,
}: ProjectCardProps) => {
  const { data: user } = useGetUserQuery()
  const isMyProject = (variant || 'homePage') === 'own';
  const is_Creator = project.creator.id === user.data?.id;

  // 計算連結目標
  const linkHref = isMyProject
    ? `/project/${is_Creator ? project.id + "/edit" : project.id}`
    : `/project/${project.id}`;

  return (
    <Grid item sx={{ height: "100%" }}>
      <Link href={linkHref} style={{ display: "block", height: "100%" }}>
        <Card
          className="project-card"
          sx={{
            border: `solid 1px ${theme.figma.Primary.normal_gray}`,
            boxShadow: "none",
            borderRadius: "20px",
            minWidth: { xs: "auto", sm: "320px" },
            width: "100%",
            height: "100%",
            minHeight: isMyProject ? undefined : { xs: "474px", sm: "474px", md: "482px" },
            display: "flex",
            flexDirection: "column",
            "&:hover": {
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }
          }}
        >
          <CardMedia
            component="img"
            src={project.background_Path
              ? `${API_SERVER_URL}/${project.background_Path}`
              : "/banner_coside_1.png"}
            sx={{ height: "190px", width: "100%", borderBottom: `1px solid ${theme.figma.neutral[80]}` }}
            onError={(e) => {
              e.currentTarget.src = "/banner_coside_1.png";
            }}
          />

          <CardContent sx={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            ...(isMyProject ? { alignItems: "flex-start" } : {})
          }}>
            <Box sx={{ marginBottom: "auto", width: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <ProjectTag projectTag={project.type} />

                {isMyProject ? (
                  is_Creator ? (
                    <Typography sx={{
                      color: theme.figma.project_tags.sideproject_implement,
                      fontSize: "16px",
                      lineHeight: "19px",
                      fontWeight: "bold"
                    }}>
                      發起人
                    </Typography>
                  ) : (
                    <Typography sx={{
                      color: theme.figma.neutral[60],
                      fontSize: "16px",
                      lineHeight: "19px"
                    }}>
                      參與者
                    </Typography>
                  )
                ) : (
                  project.creator && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {project.creator.avatar ? (
                        <MuiAvatar
                          src={`${API_SERVER_URL}/${project.creator.avatar}`}
                          alt={project.creator.name}
                          sx={{
                            width: 24, height: 24,
                            marginRight: "8px",
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
                            bgcolor: theme.figma.neutral[90],
                            color: "#656565",
                            width: 24,
                            height: 24,
                            marginRight: "8px",
                            fontSize: "14px",
                            lineHeight: "22px",
                            fontWeight: "bold",
                          }}
                        >
                          {project.creator.name.charAt(0).toUpperCase()}
                        </MuiAvatar>
                      )}
                      <Typography sx={{ color: "#7C7C7C" }}>{project.creator.name}</Typography>
                    </Box>
                  )
                )}
              </Box>

              <Typography
                component="h2"
                sx={{
                  fontSize: "24px",
                  fontWeight: "700",
                  margin: isMyProject ? "20px 0" : "24px 0",
                  lineHeight: "29px",
                  height: "58px",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {project.name}
              </Typography>

              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: "12px",
                  color: `${theme.figma.neutral[60]}`,
                  fontWeight: "700",
                  marginBottom: isMyProject ? "20px" : "24px",
                }}
              >
                <span>{project.categories.join(" / ")}・{project.duration}</span>
              </Typography>
            </Box>

            {isMyProject ? (
              <VisibleCharacterTags roles={project.roles} />
            ) : (
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    lineHeight: "26px",
                    color: "#4F4F4F",
                    fontWeight: "700",
                    marginRight: "6px",
                    flexShrink: 0,
                  }}
                >
                  <span>{TEXT_MAP.REQUIRE_POSITION}</span>
                </Typography>
                <VisibleCharacterTags roles={project.roles} />
              </Box>
            )}
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
};