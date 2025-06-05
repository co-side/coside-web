'use client';

import Image from "next/image";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Tabs , { tabsClasses } from "@mui/material/Tabs";
import Tab, { tabClasses } from "@mui/material/Tab";

const TabsTheme = styled(Box)(({ theme }) => ({
  position: "relative",
  [`.${tabsClasses.root}`]: {
    height: 40,
    minHeight: 'auto',
  },
  [`.${tabsClasses.indicator}`]: {
    backgroundColor: theme.figma.Secondary.dark_purple,
  },
  [`.${tabClasses.root}`]: {
    height: 40,
    minHeight: 'auto',
    padding: "0 20px",
    color: theme.figma.Primary.dark_gray,
  },
  [`.${tabClasses.selected}`]: {
    color: theme.figma.Secondary.dark_purple,
  },
}));

export interface TabParameters<Value extends number | string> {
  label: React.ReactNode;
  value: Value;
  iconSrc?: string;
  alt?: string;
}

interface CustomTabsProps<Value extends number | string> {
  tabs: TabParameters<Value>[];
  value: Value;
  onChange: (event: React.SyntheticEvent, value: Value) => void;
}

function CustomTabs<Value extends number | string>({ tabs, value, onChange }: CustomTabsProps<Value>) {
  return (
    <TabsTheme>
      <Box
        sx={(theme) => ({
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: theme.figma.Primary.normal_gray,
          height: '1px',
        })}
      />
      <Tabs
        value={value}
        onChange={onChange}
        aria-label="custom tabs"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                {tab.iconSrc && (
                  <Image
                    src={tab.iconSrc}
                    alt={tab.alt || ''}
                    width={20}
                    height={20}
                  />
                )}
                {tab.label}
              </Box>
            }
          />
        ))}
      </Tabs>
    </TabsTheme>
  )
}

export default CustomTabs