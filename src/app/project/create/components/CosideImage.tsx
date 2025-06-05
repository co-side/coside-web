'use client'

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useStateController } from "../hooks/useStateController";

const StyledImage = styled('img')(() => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center center",
  transition: "transform 0.3s",
  transform: "scale(1)",
  "&:hover": {
    transform: "scale(1.2)",
  },
}))

interface ImageParameter {
  value: string;
  alt?: string;
}

export type { ImageParameter }

interface ImageGridProps {
  images: ImageParameter[];
  file?: ImageParameter | null;
  onFileChange?: (file: ImageParameter | null) => void;
}

function ImageGridImage({
  images,
  file: propsFile,
  onFileChange,
}: ImageGridProps) {
  const [file, setFile] = useStateController<ImageParameter | null>(null, propsFile, onFileChange);
  const [active, setActive] = useState(file?.value || '');
  return (
    <Box sx={{ padding: "12px 0" }}>
      <Grid container spacing={1.5}>
        {images.map((item) => {
          const isActive = item.value === active;
          const imageSrc = item.value
          return (
            <Grid item xs={6} sm={3} key={item.value}>
              <Box
                onClick={() => {
                  if (isActive) {
                    setActive('')
                    setFile(null)
                  } else {
                    setActive(item.value)
                    setFile(item)
                  }
                }}
                sx={(theme) => ({
                  overflow: "hidden",
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                  borderRadius: "12px",
                  border: `1px solid ${theme.palette.grey[200]}`,
                  outline: "1px solid transparent",
                  transition: "all 0.3s",
                  "&:focus": {
                    border: `1px solid ${theme.palette.secondary.main}`,
                    outline: `1px solid ${theme.palette.secondary.main}`,
                  },
                  ...(isActive && {
                    border: `1px solid ${theme.palette.secondary.dark}`,
                    outline: `1px solid ${theme.palette.secondary.dark}`,
                  }),
                })}
              >
                <StyledImage
                  src={imageSrc}
                  alt={item.alt || ''}
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  )
}

export default ImageGridImage
