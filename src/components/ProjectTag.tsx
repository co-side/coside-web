import theme from "@/styles/theme";
import { Box } from "@mui/material";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

interface ProjectTagProps {
  name: string;
  icon: JSX.Element;
  bgColor: string;
}

const PROJECT_STYLES_MAP: Record<string, ProjectTagProps> = {
  "專案上線": {
    name: "專案落地",
    icon: (
      <LocalFireDepartmentOutlinedIcon
        sx={{ width: "18px", marginRight: "4px" }}
      />
    ),
    bgColor: theme.figma.project_tags.sideproject_implement,
  },
  "專案落地": {
    name: "專案落地",
    icon: (
      <LocalFireDepartmentOutlinedIcon
        sx={{ width: "18px", marginRight: "4px" }}
      />
    ),
    bgColor: theme.figma.project_tags.sideproject_implement,
  },
  "純作品集": {
    name: "純作品集",
    icon: (
      <EmojiObjectsIcon
        sx={{ width: "18px", marginRight: "4px" }}
      />
    ),
    bgColor: theme.figma.project_tags.sideproject_pofile,
  },
  "主題未定": {
    name: "主題未定",
    icon: (
      <EmojiObjectsIcon
        sx={{ width: "18px", marginRight: "4px" }}
      />
    ),
    bgColor: theme.figma.project_tags.sideproject_no_theme,
  },
  "launch": {
    name: "專案落地",
    icon: (
      <LocalFireDepartmentOutlinedIcon
        sx={{ width: "18px", marginRight: "4px" }}
      />
    ),
    bgColor: theme.figma.project_tags.sideproject_implement,
  },
  "titled": {
    name: "純作品集",
    icon: (
      <EmojiObjectsIcon
        sx={{ width: "18px", marginRight: "4px" }}
      />
    ),
    bgColor: theme.figma.project_tags.sideproject_pofile,
  },
  "untitled": {
    name: "主題未定",
    icon: (
      <EmojiObjectsIcon
        sx={{ width: "18px", marginRight: "4px" }}
      />
    ),
    bgColor: theme.figma.project_tags.sideproject_no_theme,
  },
};

export const ProjectTag = ({ projectTag }: { projectTag: string }) => {
  return (
    <Box
      sx={{
        backgroundColor: PROJECT_STYLES_MAP[projectTag].bgColor,
        padding: "6px 16px",
        borderRadius: "20px",
        fontSize: "14px",
        lineHeight: "18px",
        color: "#FFFFFF",
        width: "fit-content",
        display: "flex",
        alignItems: "center",
        "& svg": {
          height: "18px",
        }
      }}
    >
      {PROJECT_STYLES_MAP[projectTag].icon}
      {PROJECT_STYLES_MAP[projectTag].name}
    </Box>
  );
};
