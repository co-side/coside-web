'use client'

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import InputBase from "@mui/material/InputBase";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { useStateController } from "../hooks/useStateController";
import { styled } from "@mui/material/styles";
import { UnsplashData, useUnsplashPhotoInfiniteQuery } from "@/services/unsplash/photo";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import debounce from "@mui/utils/debounce";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
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

export type { UnsplashData }

interface UnsplashImageProps {
  file?: UnsplashData | null;
  onFileChange: (file: UnsplashData | null) => void;
}

function UnsplashImage({ onFileChange, file: propsFile }: UnsplashImageProps) {
  const [file, setFile] = useStateController<UnsplashData | null>(null, propsFile, onFileChange);
  const [active, setActive] = useState(file?.id || '');
  const [searchFormData, setSearchFormData] = useState({ query: '' });
  const { data: imageRes, hasNextPage, fetchNextPage } = useUnsplashPhotoInfiniteQuery(searchFormData)
  const images = useMemo(() => {
    if (!imageRes) return []
    return imageRes.pages.map((page) => page.results).flat();
  }, [imageRes])
  const { ref: nextPageElement } = useIntersectionObserver({
    onNext: () => fetchNextPage(),
    hasNext: hasNextPage,
  })
  const onSearch = useMemo(() => {
    return debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchFormData((prev) => ({ ...prev, query: event.target.value }));
    }, 400)
  }, [])
  return (
    <Box sx={{ height: "100%", paddingTop: '12px' }}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon sx={(theme) => ({ color: theme.palette.grey[400] })} />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="搜尋圖片..."
          inputProps={{ "aria-label": "search" }}
          onChange={onSearch}
          sx={(theme) => ({ color: theme.palette.grey[400] })}
        />
      </Search> 
      <Box
        sx={{
          height: "208px",
          overflowY: "auto",
          overflowX: "hidden",
          marginTop: 1.5,
        }}
      >
        <Grid container spacing={1.5}>
          {images.map((item) => {
            const isActive = item.id === active;
            const imageSrc = item.urls.thumb
            return (
              <Grid item xs={6} sm={3} key={item.id}>
                <Box
                  onClick={() => {
                    if (isActive) {
                      setActive('')
                      setFile(null)
                    } else {
                      setActive(item.id)
                      setFile(item)
                    }
                  }}
                  sx={(theme) => ({
                    overflow: "hidden",
                    cursor: "pointer",
                    height: "80px",
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
                    alt={item.id}
                  />
                </Box>
              </Grid>
            );
          })}
          <Grid item xs={12} ref={nextPageElement}>
            {hasNextPage && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: '12px',
                }}
              >
                <CircularProgress />
              </Box>
            )}
            {Boolean(images.length && !hasNextPage) && (
              <Typography
                sx={{
                  textAlign: "center",
                  color: (theme) => theme.palette.grey[100],
                }}
              >
                已經沒有更多圖片了
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default UnsplashImage;
