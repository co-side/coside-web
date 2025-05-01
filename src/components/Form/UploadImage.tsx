import { useFormikContext } from "formik";
import {
  ChangeEventHandler,
  DragEvent,
  DragEventHandler,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  FormHelperText,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import CachedIcon from "@mui/icons-material/Cached";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { getPhotosByQuery } from "@/api/unsplash";
import theme from "@/styles/theme";
import { FormValues } from "@/hooks/useFormControl";
import { useFormControlContext } from "@/contexts/FormControlContext";

const StyledUploadWrapper = styled("div")(() => ({
  position: "relative",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  borderRadius: "12px",
  overflow: "hidden",
  input: {
    display: "none",
  },
}));

const Search = styled("div")(() => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
}));

const SearchIconWrapper = styled("div")(() => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(() => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
  width: "100%",
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: 12,
}));

const StyledImage = styled(Image)(() => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center center",
  transition: "transform 0.3s",
  transform: "scale(1)",
  "&:hover": {
    transform: "scale(1.2)",
  },
}));

const cosideDefaultImages = ["images/default/banner_coside_1.png"];

const TabButton = ({ onClick, isActive, iconSrc, label }) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        color: theme.palette.grey[400],
        display: "flex",
        alignItems: "center",
        gap: "4px",
        borderRadius: 0,
        position: "relative",
        padding: "10px 20px",
        "&:hover": {
          color: theme.palette.secondary.main,
          bgcolor: "transparent",
        },
        "&:hover::after": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "2px",
          backgroundColor: theme.palette.secondary.main,
        },
        ...(isActive && {
          color: theme.palette.secondary.dark,
          bgcolor: "transparent",
          "&::after": {
            content: '""',
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "2px",
            backgroundColor: theme.palette.secondary.dark,
          },
        }),
      }}
    >
      <Image
        src={iconSrc}
        alt={label}
        width={20}
        height={20}
        color={`${theme.palette.grey[200]}`}
        style={{ marginRight: "1.5px" }}
      />
      <Typography
        sx={{
          lineHeight: "19px",
          textTransform: "none",
        }}
      >
        {label}
      </Typography>
    </Button>
  );
};

const ImageGrid = ({
  images = [],
  onImageClick,
  showImageSrc,
  imageWidth = 135,
  imageHeight = 80,
  activeIndex,
  setActiveIndex,
}) => {
  const handleImageClick = (index: number, item: string) => {
    setActiveIndex(index);
    onImageClick(item);
  };

  return (
    <Grid container spacing={1.5} sx={{ marginTop: "-11px" }}>
      {images.map((item, index) => {
        const src = showImageSrc(item);
        const isActive = activeIndex === index;

        return (
          <Grid item xs={6} sm={3} key={src}>
            <Box
              onClick={() => handleImageClick(index, item)}
              sx={{
                overflow: "hidden",
                cursor: "pointer",
                width: "100%",
                height: imageHeight,
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
              }}
            >
              <StyledImage
                src={src}
                alt={`image ${index + 1}`}
                width={imageWidth}
                height={imageHeight}
              />
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default function UploadImage() {
  const { errors, setFieldValue } =
    useFormikContext<FormValues>();
  const formControl = useFormControlContext();
  const errorStatus = Boolean(
    formControl.imageType === "upload"
      ? errors?.bannerUpload
      : formControl.imageType === "coside"
        ? errors?.bannerCoside
        : formControl.imageType === "unsplash"
          ? errors?.bannerUnsplash
          : false
  );
  const helperText =
    formControl.imageType === "upload"
      ? typeof errors?.bannerUpload === "string"
        ? errors.bannerUpload
        : (errors?.bannerUpload as any)?.message || ""
      : formControl.imageType === "coside"
        ? typeof errors?.bannerCoside === "string"
          ? errors.bannerCoside
          : (errors?.bannerCoside as any)?.message || ""
        : formControl.imageType === "unsplash"
          ? typeof errors?.bannerUnsplash === "string"
            ? errors.bannerUnsplash
            : (errors?.bannerUnsplash as any)?.message || ""
          : "";

  const inputRef = useRef<HTMLInputElement>(null);
  const [isHover, setIsHover] = useState(false);
  const listRef = useRef(null);

  const stopDefault = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleFile = async (_file: File | null = null) => {
    if (!_file) {
      return;
    }

    setFieldValue("bannerUpload", _file);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        formControl.setPreviewImage(fileReader.result);
      }
    };

    fileReader.readAsDataURL(_file);
  };

  const deleteImage = () => {
    formControl.setPreviewImage("");
    setFieldValue("bannerUpload", undefined);
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    stopDefault(e);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    formControl.setSearchValue(e.target.value);
  };

  const onSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim();
    if (value === "") {
      alert("請輸入搜尋內容");
    } else {
      formControl.setFilterValue(value);
      formControl.setActiveUnsplashIndex(-1);
      formControl.setUnsplashImages([]);
      setFieldValue("bannerUnsplash", undefined);
    }
  };

  const getPhotos = useCallback(
    async (page = 1, isNew = true) => {
      try {
        const data = await getPhotosByQuery(formControl.filterValue, page, 12);
        const photos = data?.results || data;
        formControl.setUnsplashImages((prevData) =>
          isNew ? photos : [...prevData, ...photos]
        );
        formControl.currentPage.current = page;
      } catch (error) {
        console.error(error);
      }
    },
    [
      formControl.filterValue,
      formControl.currentPage,
      formControl.setUnsplashImages,
    ]
  );

  const scrollEvent = useCallback(
    (evt: React.UIEvent<HTMLDivElement>) => {
      const target = evt.target as HTMLElement;
      const height = target.scrollHeight - target.clientHeight;
      if (target.scrollTop >= height && formControl.filterValue !== "") {
        formControl.currentPage.current++;
        getPhotos(formControl.currentPage.current, false);
      }
    },
    [formControl.filterValue, formControl.currentPage, getPhotos]
  );

  useEffect(() => {
    if (formControl.filterValue === "" || formControl.currentPage.current > 1)
      return;
    getPhotos(1, true);
  }, [formControl.filterValue, formControl.currentPage, getPhotos]);

  useEffect(() => {
    if (formControl.imageType === "unsplash" && listRef.current) {
      const scrollContainer = listRef.current;
      scrollContainer.addEventListener("scroll", scrollEvent);
      return () => scrollContainer.removeEventListener("scroll", scrollEvent);
    }
  }, [formControl.imageType, formControl.filterValue, scrollEvent]);

  const chooseImage = (item) => {
    if (formControl.imageType === "coside") {
      setFieldValue("bannerCoside", item);
    } else if (formControl.imageType === "unsplash") {
      setFieldValue("bannerUnsplash", item);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        sx={{
          textAlign: "left",
          color: theme.palette.grey[400],
          marginBottom: 2,
        }}
      >
        選擇一張能代表專案的圖片，讓你的合作夥伴更了解你想做什麼！
      </Typography>
      <Box
        sx={{
          borderRadius: 3,
          border: `1px solid ${theme.palette.grey[200]}`,
          padding: "12px",
          ...(errorStatus && {
            border: `1px solid ${theme.palette.error.main}`,
          }),
        }}
      >
        <Box
          sx={{
            display: "flex",
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          <TabButton
            onClick={() => {
              formControl.setImageType("upload");
              setFieldValue("imageType", "upload");
            }}
            isActive={formControl.imageType === "upload"}
            iconSrc="/upload_icon.svg"
            label="從電腦上傳"
          />
          <TabButton
            onClick={() => {
              formControl.setImageType("coside");
              setFieldValue("imageType", "coside");
            }}
            isActive={formControl.imageType === "coside"}
            iconSrc="/coside_icon.svg"
            label="CoSide"
          />
          <TabButton
            onClick={() => {
              formControl.setImageType("unsplash");
              setFieldValue("imageType", "unsplash");
            }}
            isActive={formControl.imageType === "unsplash"}
            iconSrc="/unsplash_icon.svg"
            label="Unsplash"
          />
        </Box>
        <Box
          sx={{
            marginTop: 1.5,
            height: "260px",
            overflow: "hidden",
          }}
        >
          {formControl.imageType === "upload" && (
            <Box sx={{ width: "100%", height: "100%" }}>
              <StyledUploadWrapper>
                {formControl.previewImage ? (
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      padding: 0,
                    }}
                  >
                    <Image
                      src={formControl.previewImage}
                      alt="upload image"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <ButtonGroup
                      variant="contained"
                      aria-label="Basic button group"
                      sx={{
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
                      }}
                    >
                      <Button
                        sx={{
                          padding: "4px 10px",
                          bgcolor: "rgba(31, 31, 31, 0.7)",
                          "&:hover": {
                            backgroundColor: "rgba(31, 31, 31, 0.8)",
                          },
                        }}
                        onClick={() => inputRef.current?.click()}
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
                          sx={{
                            width: "16px",
                            height: "16px",
                            color: theme.figma.status.normal_red,
                          }}
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
                      onClick={() => inputRef.current?.click()}
                      onDragEnter={() => setIsHover(true)}
                      onDragLeave={() => setIsHover(false)}
                      onMouseEnter={() => setIsHover(true)}
                      onMouseLeave={() => setIsHover(false)}
                      onDragOver={(e) => stopDefault(e)}
                      onDrop={handleDrop}
                      sx={{ mt: "10px", maxWidth: "178px", width: "100%" }}
                    >
                      上傳圖片
                    </Button>
                  </>
                )}
                <input
                  type="file"
                  ref={inputRef}
                  accept=".jpg, .png, .jpeg"
                  onChange={handleChange}
                />
              </StyledUploadWrapper>
            </Box>
          )}
          {formControl.imageType === "coside" && (
            <Box
              sx={{ height: "260px", overflowY: "auto", overflowX: "hidden" }}
            >
              <ImageGrid
                images={cosideDefaultImages}
                showImageSrc={(item) =>
                  `https://coside-api.zeabur.app/${item}`
                }
                onImageClick={chooseImage}
                activeIndex={formControl.activeCosideIndex}
                setActiveIndex={formControl.setActiveCosideIndex}
              />
            </Box>
          )}
          {formControl.imageType === "unsplash" && (
            <Box sx={{ height: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon sx={{ color: theme.palette.grey[400] }} />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="搜尋圖片..."
                  inputProps={{ "aria-label": "search" }}
                  value={formControl.searchValue} // 綁定 value
                  onChange={handleSearchChange} // 處理輸入變化
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    e.key === "Enter" && onSearch(e)
                  }
                  sx={{ color: theme.palette.grey[400] }}
                />
              </Search>
              <Box
                sx={{
                  height: "208px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  marginTop: 1.5,
                }}
                ref={listRef}
              >
                <ImageGrid
                  images={formControl.unsplashImages}
                  showImageSrc={(item) => item.urls.thumb}
                  onImageClick={chooseImage}
                  activeIndex={formControl.activeUnsplashIndex}
                  setActiveIndex={formControl.setActiveUnsplashIndex}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      {errorStatus && (
        <FormHelperText
          error
          sx={{ marginLeft: "14px", marginRight: "14px", marginTop: "3px" }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}
