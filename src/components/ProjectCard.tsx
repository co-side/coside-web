import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import Image from "next/image";

import { ProjectTag } from "./ProjectTag";
import { CharacterTag } from "./CharacterTag";

export interface ProjectCardProps {
  thumbnail: string;
  title: string;
  projectTag: string;
  characterTags: string[];
  projectType: string;
  projectDuration: string;
  projectOwner: string;
  projectOwnerAvatar: string;
}

const TEXT_MAP: Record<string, string> = {
  REQUIRE_POSITION: "徵求｜",
  REQUIRE_TYPE: "類型｜",
  REQUIRE_DURATION: "時長｜",
  CHECK: "查看專案",
};

export const ProjectCard = ({
  projectCard,
}: {
  projectCard: ProjectCardProps;
}) => {
  const {
    thumbnail,
    title,
    projectTag,
    characterTags,
    projectType,
    projectDuration,
    projectOwner,
    projectOwnerAvatar,
  } = projectCard;
  const renderCharacterTag = () =>
    characterTags.map((tag: string) => (
      <CharacterTag key={tag} character={tag} />
    ));

  return (
    <Grid item xs={1} sm={1} md={1} lg={1}>
    <Card
      className="project-card"
      sx={{ borderRadius: "20px", minWidth: "320px" }}
    >
      <CardMedia
        component="img"
        src={thumbnail}
        sx={{ height: "190px", width: "100%" }}
      />
      <CardContent sx={{ padding: "24px" }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
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
            }}
          >
            <Image
              src={projectOwnerAvatar}
              alt={projectOwner}
              width={32}
              height={32}
            />
          </Box>
          <Typography sx={{ color: "#7C7C7C" }}>{projectOwner}</Typography>
        </Box>
        <ProjectTag projectTag={projectTag} />
        <Typography
          component="h2"
          sx={{ fontSize: "24px", fontWeight: "700", margin: "16px 0" }}
        >
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{
              fontSize: "16px",
              color: "#4F4F4F",
              fontWeight: "700",
              marginRight: "6px",
            }}
          >
            <span>{TEXT_MAP.REQUIRE_POSITION}</span>
          </Typography>
          <Box sx={{ display: "flex" }}>{renderCharacterTag()}</Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
          <Typography
            sx={{
              fontSize: "16px",
              color: "#4F4F4F",
              fontWeight: "700",
              marginRight: "6px",
            }}
          >
            <span>{TEXT_MAP.REQUIRE_TYPE}</span>
          </Typography>
          <Box sx={{ color: "#7C7C7C" }}>{projectType}</Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" ,marginTop: "12px", marginBottom: "12px" }}>
          <Typography
            sx={{
              fontSize: "16px",
              color: "#4F4F4F",
              fontWeight: "700",
              marginRight: "6px",
            }}
          >
            <span>{TEXT_MAP.REQUIRE_DURATION}</span>
          </Typography>
          <Box sx={{ color: "#7C7C7C" }}>{projectDuration}</Box>
        </Box>
        
        <Button
          color="primary"
          variant="contained"
          sx={{ width: "100%", color: "#FFFFFF", borderRadius: "12px"}}
        >
          {TEXT_MAP.CHECK}
        </Button>
      </CardContent>
    </Card>
    </Grid>
  );
};
