'use client';
import { useEffect, useState } from "react";
import { Box, Fade } from "@mui/material";
import theme from "@/styles/theme";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    // 初始化上一次滾動位置
    setPrevScrollPos(window.scrollY);

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // 當滾動位置大於100像素，並且是向上滾動時顯示按鈕
      if (currentScrollPos > 100 && currentScrollPos < prevScrollPos) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // 更新上一次滾動位置
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Fade in={isVisible} timeout={500}>
      <Box
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: 0,
          right: 0,
          left: 0,
          height: { xs: "67px", md: "121px" },
          fontSize: { xs: "16px", md: "20px" },
          lineHeight: { xs: "19px", md: "24px" },
          color: theme.figma.Primary.dark_blue,
          background: `linear-gradient(rgba(241, 247, 255, 0), ${theme.figma.Primary.light_blue})`,
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
          // 即使不可見也保留在 DOM 中，但不會影響交互
          visibility: isVisible ? "visible" : "hidden",
        }}
      >
        回到最上面
      </Box>
    </Fade>
  );
};

export default BackToTopButton;