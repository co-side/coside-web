'use client';

import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";

import Tabs, { TabParameters } from "./Tabs";
import UploadImage from "./UploadImage";
import ImageGridImage, { ImageParameter } from "./CosideImage";
import UnsplashImage, { UnsplashData } from "./UnsplashImage";

type ImageType = "upload" | "coside" | "unsplash";

export type FileInfo = { type: 'upload', file: File}
  | { type: 'coside', file: ImageParameter }
  | { type: 'unsplash', file: UnsplashData };

interface ProjectImagePickerProps {
  value?: null | FileInfo;
  onFileChange: (file: null | FileInfo) => void;
  isError?: boolean;
  helperText?: string;
}

export default function ProjectImagePicker({ onFileChange, isError, helperText, value: propsValue }: ProjectImagePickerProps) {
  const [imageType, setImageType] = useState<ImageType>('upload');

  const tabs = useMemo(() => [
    { label: "從電腦上傳", value: "upload", iconSrc: "/upload_icon.svg" },
    { label: "CoSide", value: "coside", iconSrc: "/coside_icon.svg" },
    { label: "Unsplash", value: "unsplash", iconSrc: "/unsplash_icon.svg" },
  ] as const satisfies TabParameters<ImageType>[], [])

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        sx={(theme) => ({
          textAlign: "left",
          color: theme.palette.grey[400],
          marginBottom: 2,
        })}
      >
        選擇一張能代表專案的圖片，讓你的合作夥伴更了解你想做什麼！
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        sx={(theme) => ({
          height: 330,
          border: isError ? `1px solid ${theme.figma.form.helper_error}` : `1px solid ${theme.figma.Primary.normal_gray}`,
          borderRadius: 3,
          padding: '4px 12px 12px'
        })}
      >
        <Tabs
          tabs={tabs}
          value={imageType}
          onChange={(_event, newValue: ImageType) => setImageType(newValue)}
        />
        {(() => {
          switch (imageType) {
            case "upload":
              return (
                <UploadImage
                  file={propsValue && propsValue.type === 'upload' ? propsValue.file : undefined}
                  onFileChange={(file) => {
                    if (file) {
                      onFileChange({ type: 'upload', file });
                    } else {
                      onFileChange(null);
                    }
                  }}
                />
              );
            case "coside":
              return (
                <ImageGridImage
                  file={propsValue && propsValue.type === 'coside' ? propsValue.file : undefined}
                  images={[
                    {
                      value: '/default_img.png'
                    }
                  ]}
                  onFileChange={(file) => {
                    if (file) {
                      onFileChange({ type: 'coside', file });
                    } else {
                      onFileChange(null);
                    }
                  }}
                />
              );
            case "unsplash":
              return (
                <UnsplashImage 
                  file={propsValue && propsValue.type === 'unsplash' ? propsValue.file : undefined}
                  onFileChange={(file) => {
                    if (file) {
                      onFileChange({ type: 'unsplash', file });
                    } else {
                      onFileChange(null);
                    }
                  }}
                />
              );
            default:
              return null;
          }
        })()}
      </Box>
      {isError && (
        <FormHelperText
          sx={(theme) => ({
            color: theme.figma.form.helper_error,
            margin: '3px 14px 0',
          })}
        >
          {helperText}
        </FormHelperText>
      )}
    </Box>
  )
}
