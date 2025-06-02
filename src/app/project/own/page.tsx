"use client";

import { useEffect, useState } from "react";
import { userGetCreatorInfo } from "@/api/user";
import styles from "../../page.module.css";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { ProjectCard, ProjectCardProps } from "@/components/ProjectCard";
import BackToTopButton from "@/components/BackToTopButton";
import useLoginStore from "@/stores/loginStore";

export default function MyProjects() {
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useLoginStore(); // 你自己的登入 store

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await userGetCreatorInfo(userInfo.id);
      setProjects(data.data.projects);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className={styles.main}>
      <Box sx={{ maxWidth: "1224px", width: "100%" }}>
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
              fontSize: { xs: "24px",  md: "32px" },
              lineHeight: { xs: "28px", md: "38px" },
            }}
          >
            我的專案
          </Typography>
        </Box>
        <Grid
          container
          columns={{ xs: 1, md: 2, lg: 3 }}
          rowSpacing={{ xs: 2.5, md: 4 }}
          columnSpacing={3}
        >
          {projects.map(({ project }) => (
            <Grid item xs={1} key={project.id}>
              <ProjectCard project={project} variant="own" />
            </Grid>
          ))}
        </Grid>

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              padding: "20px",
            }}
          >
            <CircularProgress color="warning" />
          </Box>
        )}
      </Box>
      <BackToTopButton />
    </main>
  )
};