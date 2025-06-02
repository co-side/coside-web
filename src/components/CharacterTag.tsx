"use client";
import theme from "@/styles/theme";

// Emerail: ready to remove
const CHARACTER_STYLES_MAP: Record<string, Record<string, string>> = {
  // 正式
  "UI設計師": {
    name: "UI",
    mainColor: theme.figma.profession_tags.outline_ui,
    bgColor: theme.figma.profession_tags.bg_ui,
  },
  "UX設計師": {
    name: "UX",
    mainColor: theme.figma.profession_tags.outline_ux,
    bgColor: theme.figma.profession_tags.bg_ux,
  },
  "UIUX/產品設計師": {
    name: "UIUX",
    mainColor: theme.figma.profession_tags.outline_uiux,
    bgColor: theme.figma.profession_tags.bg_uiux,
  },
  "使用者研究員": {
    name: "UXR",
    mainColor: theme.figma.profession_tags.outline_uxr,
    bgColor: theme.figma.profession_tags.bg_uxr,
  },
  "前端工程師": {
    name: "前端",
    mainColor: theme.figma.profession_tags.outline_frontend,
    bgColor: theme.figma.profession_tags.bg_frontend,
  },
  "後端工程師": {
    name: "後端",
    mainColor: theme.figma.profession_tags.outline_backend,
    bgColor: theme.figma.profession_tags.bg_backend,
  },
  "全端工程師": {
    name: "全端",
    mainColor: theme.figma.profession_tags.outline_fullstack,
    bgColor: theme.figma.profession_tags.bg_fullstack,
  },
  "PM": {
    name: "PM",
    mainColor: theme.figma.profession_tags.outline_pm,
    bgColor: theme.figma.profession_tags.bg_pm,
  },
  "其他": {
    mainColor: theme.figma.profession_tags.outline_others,
    bgColor: theme.figma.profession_tags.bg_others,
  },
  // 暫時
  "UI Designer": {
    name: "UI",
    mainColor: theme.figma.profession_tags.outline_ui,
    bgColor: theme.figma.profession_tags.bg_ui,
  },

  "(UI/UX)Product Designer": {
    name: "UIUX",
    mainColor: theme.figma.profession_tags.outline_uiux,
    bgColor: theme.figma.profession_tags.bg_uiux,
  },
  "User Researcher": {
    name: "UXR",
    mainColor: theme.figma.profession_tags.outline_uxr,
    bgColor: theme.figma.profession_tags.bg_uxr,
  },
  "Frontend": {
    name: "前端",
    mainColor: theme.figma.profession_tags.outline_frontend,
    bgColor: theme.figma.profession_tags.bg_frontend,
  },
  "Frontend Engineer": {
    name: "前端",
    mainColor: theme.figma.profession_tags.outline_frontend,
    bgColor: theme.figma.profession_tags.bg_frontend,
  },
  "Backend Engineer": {
    name: "後端",
    mainColor: theme.figma.profession_tags.outline_backend,
    bgColor: theme.figma.profession_tags.bg_backend,
  },
  "Fullstack Engineer": {
    name: "全端",
    mainColor: theme.figma.profession_tags.outline_fullstack,
    bgColor: theme.figma.profession_tags.bg_fullstack,
  },
  "Project Manager": {
    name: "PM",
    mainColor: theme.figma.profession_tags.outline_pm,
    bgColor: theme.figma.profession_tags.bg_pm,
  },
  "Other": {
    name: "其他",
    mainColor: theme.figma.profession_tags.outline_others,
    bgColor: theme.figma.profession_tags.bg_others,
  },
};

type CharacterTagProps = {
  character: string;
  addText?: string;
  elseName?: string;
  type?: "default" | "square" | "detailInfo";
};

export const CharacterTag = ({
  character,
  addText = "",
  elseName = "其他",
  type = "default"
}: CharacterTagProps) => {
  const styleMap = CHARACTER_STYLES_MAP[character];

  const computedStyle = {
    padding: type === "detailInfo" ? "7px 32px" : "5px 16px",
    borderRadius: type === "square" ? "12px" : "20px",
    fontSize: type === "detailInfo" ? "20px" : "14px",
    fontWeight: type === "detailInfo" ? "bold" : "normal",
    lineHeight:
      type === "square"
        ? "26px"
        : type === "detailInfo"
        ? "24px"
        : "17px",
    backgroundColor: styleMap.bgColor,
    border: `1px solid ${styleMap.mainColor}`,
    color: styleMap.mainColor,
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap"
  };

  return (
    <span style={computedStyle}>
      {character === "其他"
        ? elseName.length > 6
          ? elseName.slice(0, 6) + "..."
          : elseName
        : styleMap.name}
      {addText !== "" && (
        <span style={{ marginLeft: "12px" }}>{addText}</span>
      )}
    </span>
  );
};
