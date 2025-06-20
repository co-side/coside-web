"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@mui/material";
import { Box, Button, Grid, Typography, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
  GetProjectsInfiniteQueryParams,
  useGetProjectsFirstQuery,
  useGetProjectsInfiniteQuery,
} from "@/services/project/getProjects";

import { useAuth } from "@/contexts/AuthContext";
import { ProjectCard } from "@/components/ProjectCard";
import BackToTopButton from "@/components/BackToTopButton";
import RedirectAlert from "@/components/RedirectAlert";
import FilterDropdownList, { FilterComponentProps } from "@/components/FilterDropdownList";

import styles from "./page.module.css";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";


export default function Home() {
  const theme = useTheme();
  const { isLogin } = useAuth();
  const { data: initProjects } = useGetProjectsFirstQuery();
  const [queryParams, setQueryParams] = useState<GetProjectsInfiniteQueryParams>({})
  const prevQueryParams = useRef<GetProjectsInfiniteQueryParams>({})
  const { data: allProjects, hasNextPage, fetchNextPage, refetch } = useGetProjectsInfiniteQuery(queryParams);
  const { ref: nextPageElement } = useIntersectionObserver({
    onNext: () => fetchNextPage(),
    hasNext: hasNextPage,
  });

  useEffect(() => {
    if (JSON.stringify(prevQueryParams.current) === JSON.stringify(queryParams)) {
      return;
    }
    refetch();
  }, [refetch, queryParams])

  const onFilterApply: FilterComponentProps['onFilterApply'] = ({ roles, categories }) => {
    setQueryParams((prev) => {
      const params: GetProjectsInfiniteQueryParams = {
        roles: roles.length > 0 ? roles : null,
        categories: categories.length > 0 ? categories : null,
      }
      prevQueryParams.current = prev;
      const newQueryParams = { ...prev, ...params };
      return newQueryParams
    });
  }
  return (
    <main className={styles.main}>
      <Box
        sx={{
          maxWidth: "1224px",
          width: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: { xs: "40px", md: "87px" },
            marginBottom: { xs: "20px", md: "44px" },
          }}
        >
          <Typography
            sx={{
              margin: "8px 0",
              fontWeight: "700",
              fontSize: { xs: "24px", md: "32px" },
              lineHeight: { xs: "28px", md: "38px" },
            }}
          >
            探索新專案
          </Typography>
          <FilterDropdownList onFilterApply={onFilterApply} />
        </Box>

        {(() => {
          const projects = allProjects || initProjects.projects;
          if (projects.length === 0) {
            return (
              <RedirectAlert
                themeColor="blue"
                imageSrc="/project_empty.svg"
                imageAlt="No Projects"
                title={
                  <>
                    這裡還沒有專案
                    <br />
                    或許你的想法可以成為第一個！
                  </>
                }
              />
            );
          }
          return (
            <Grid
              container
              columns={{ xs: 1, md: 2, lg: 3 }}
              rowSpacing={{ xs: 2.5, md: 4 }}
              columnSpacing={3}
            >
              {projects.map((project) => (
                <Grid item xs={1} key={project.id}>
                  <ProjectCard project={project} />
                </Grid>
              ))}
            </Grid>
          );
        })()}
        <div ref={nextPageElement}>
          {hasNextPage ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: { xs: "20px", md: "40px" },
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Typography
              sx={{
                textAlign: "center",
                fontSize: { xs: "16px", md: "20px" },
                lineHeight: { xs: "19px", md: "23px" },
                mt: { xs: "24px", md: "66px" },
              }}
            >
              你已經看完所有專案
            </Typography>
          )}
        </div>

        {isLogin && (
          <Box
            position="fixed"
            sx={{
              bottom: { xs: "32px", md: "5vh" },
              right: { xs: "32px", md: "4vw" },
              zIndex: 999,
            }}
          >
            <Button
              LinkComponent={Link}
              variant="contained"
              href="/project/create"
              color="warning"
              sx={{
                display: "flex",
                alignItems: "center",
                padding: { xs: "14px", md: "20px 33px" },
                borderRadius: { xs: "50%", md: "40px" },
                boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.2)",
                color: theme.figma.form.text_default,
                bgcolor: theme.figma.Tertiary.yellow,
              }}
            >
              <AddIcon
                sx={{
                  width: { xs: "40px", md: "24px" },
                  height: { xs: "40px", md: "24px" },
                  marginRight: { xs: 0, md: "10px" },
                }}
              />
              <Typography
                sx={{
                  display: { xs: "none", md: "block" },
                  fontSize: "20px",
                  lineHeight: "24px",
                  fontWeight: "400",
                }}
              >
                發起專案
              </Typography>
            </Button>
          </Box>
        )}
      </Box>
      <BackToTopButton />
    </main>
  );
}
