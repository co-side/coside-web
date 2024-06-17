"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    professionTags: {
      pmBg: string;
      pmOutline: string;
      uiuxBg: string;
      uiuxOutline: string;
      uxBg: string;
      uxOutline: string;
      uiBg: string;
      uiOutline: string;
      frontEndBg: string;
      frontEndOutline: string;
      backEndBg: string;
      backEndOutline: string;
      uxrBg: string;
      uxrOutline: string;
      fullStackBg: string;
      fullStackOutline: string;
      othersBg: string;
      othersOutline: string;
      extraLightBlue: string;
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    professionTags?: {
      pmBg?: string;
      pmOutline?: string;
      uiuxBg?: string;
      uiuxOutline?: string;
      uxBg?: string;
      uxOutline?: string;
      uiBg?: string;
      uiOutline?: string;
      frontEndBg?: string;
      frontEndOutline?: string;
      backEndBg?: string;
      backEndOutline?: string;
      uxrBg?: string;
      uxrOutline?: string;
      fullStackBg?: string;
      fullStackOutline?: string;
      othersBg?: string;
      othersOutline?: string;
      extraLightBlue?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#007DC3",
      dark: "#07689E",
      light: "#CBE8FF",
    },
    secondary: {
      main: "#BF8FFD",
      dark: "#9868D6",
      light: "#F1E7FF",
    },
    warning: {
      main: "#ffe500"
    },
    common: {
      black: "#343434",
      white: "#fff",
    },
    grey: {
      100: "#9A9A9A",
      200: "#D0D0D0",
      300: "#F8F8F8",
    },
  },
  professionTags: {
    pmBg: "#DCC1FF",
    pmOutline: "#9747FF",
    uiuxBg: "#FFDE9C",
    uiuxOutline: "#F27F00",
    uxBg: "#FFCBE4",
    uxOutline: "#F14296",
    uiBg: "#FFFB9C",
    uiOutline: "#FFA800",
    frontEndBg: "#A9D1FF",
    frontEndOutline: "#007DC3",
    backEndBg: "#D1F1C2",
    backEndOutline: "#54B153",
    uxrBg: "#C4F2F2",
    uxrOutline: "#01B3DA",
    fullStackBg: "#B5A9FF",
    fullStackOutline: "#3834D0",
    othersBg: "#ECECEC",
    othersOutline: "#656565",
    extraLightBlue: "#F1F7FF",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          ".MuiOutlinedInput-notchedOutline": {
            borderRadius: "12px",
          },
        },
      },
    },
  },
});

export default theme;
