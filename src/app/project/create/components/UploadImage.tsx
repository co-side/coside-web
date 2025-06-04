'use client';

import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import CachedIcon from "@mui/icons-material/Cached";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { showOpenFilePicker } from "../utils/showOpenFilePicker";
import { useMemo, useState } from "react";
import { useStateController } from "../hooks/useStateController";

interface UploadImageProps {
  file?: File | null;
  onFileChange?: (file: File | null) => void;
}

function UploadImage({ file: propsFile, onFileChange }: UploadImageProps) {
  const [file, setFile] = useStateController<File | null>(null, propsFile, onFileChange);

  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : null;
  }, [file])
  const [isHover, setIsHover] = useState(false);
  const onUploadSelector = async () => {
    const result = await showOpenFilePicker({
      types: [
        {
          description: "Images",
          accept: {
            "image/*": [".png", ".jpg", ".jpeg"],
          },
        },
      ],
    })
    if (result && result.length > 0) {
      const selectedFile = result[0];
      const fileHandle = await selectedFile.getFile();
      setFile(fileHandle);
    }
  }
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.dataTransfer.files?.[0]
    if (file) {
      setFile(file);
    }
  }
  const deleteImage = () => {
    setFile(null);
  }
  return (
    <Box 
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {previewImage ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
          }}
          flex={1}
        >
          <Image
            src={previewImage}
            alt="upload image"
            fill
            style={{ objectFit: "cover" }}
          />
          <ButtonGroup
            variant="contained"
            aria-label="Basic button group"
            sx={(theme) => ({
              position: "absolute",
              top: 8,
              right: 8,
              boxShadow: "none",
              "& .MuiButtonGroup-firstButton, & .MuiButtonGroup-middleButton":
                {
                  borderColor: `${theme.figma.btn.outline.bg_default} !important`,
                },
              "& .MuiButtonGroup-firstButton": {
                borderRadius: "6px 0 0 6px",
              },
              "& .MuiButtonGroup-lastButton": {
                borderRadius: "0 6px 6px 0",
              },
            })}
          >
            <Button
              sx={{
                padding: "4px 10px",
                bgcolor: "rgba(31, 31, 31, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(31, 31, 31, 0.8)",
                },
              }}
              onClick={onUploadSelector}
            >
              <CachedIcon
                sx={{
                  width: "16px",
                  height: "16px",
                }}
              />
            </Button>
            <Button
              sx={{
                padding: "4px 10px",
                bgcolor: "rgba(31, 31, 31, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(31, 31, 31, 0.8)",
                },
              }}
              onClick={deleteImage}
            >
              <DeleteOutlineOutlinedIcon
                sx={(theme) => ({
                  width: "16px",
                  height: "16px",
                  color: theme.figma.status.normal_red,
                })}
              />
            </Button>
          </ButtonGroup>
        </Box>
      ) : (
        <>
          <Typography
            variant="body2"
            color="grey.500"
            sx={{ lineHeight: 1.6 }}
          >
            圖片尺寸：1125 × 660 px
          </Typography>
          <Typography
            variant="body2"
            color="grey.500"
            sx={{ lineHeight: 1.6 }}
          >
            檔案大小：小於 5 Mb
          </Typography>
          <Button
            component="div"
            size="large"
            variant="outlined"
            color="secondary"
            className={isHover ? "is-hover" : ""}
            onClick={onUploadSelector}
            onDragEnter={() => setIsHover(true)}
            onDragLeave={() => setIsHover(false)}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onDragOver={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onDrop={onDrop}
            sx={{ mt: "10px", maxWidth: "178px", width: "100%" }}
          >
            上傳圖片
          </Button>
        </>
      )}
    </Box>
  )
}

export default UploadImage;