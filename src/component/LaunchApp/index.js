import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import styles from "./styles";
import { openLink } from "../../utils/common";

const LaunchApp = () => {
  const isMobile = useMediaQuery("(max-width:768px)");

  const mobileStyles = {
    wrapper: {
      padding: isMobile ? "20px" : styles.wrapper.padding,
    },
    imageContainer: {
      minHeight: isMobile ? "300px" : styles.imageContainer.minHeight,
      padding: isMobile ? "20px 10px" : styles.imageContainer.padding,
    },
    content: {
      maxWidth: isMobile ? "100%" : styles.content.maxWidth,
      padding: isMobile ? "0" : styles.content.padding,
    },
    typography: {
      fontSize: isMobile ? "2rem" : "3.75rem",
      lineHeight: isMobile ? "2.5rem" : "4.5rem",
      marginBottom: isMobile ? "1rem" : "2rem",
    },
    noteText: {
      fontSize: isMobile ? "1rem" : "1.5rem",
      marginBottom: isMobile ? "1.5rem" : "2rem",
    },
    button: {
      width: isMobile ? "100%" : "auto",
      fontSize: isMobile ? "1rem" : "1.25rem",
      padding: isMobile ? "10px 20px" : "12px 24px",
      background: "white !important",
      color: "black !important",
    },
  };

  return (
    <Box sx={{ ...styles.wrapper, ...mobileStyles.wrapper }}>
      <Box
        style={{
          background: isMobile
            ? "none"
            : "center/contain no-repeat url(/images/ai/launch-app-bg.png)",
        }}
        sx={{ ...styles.imageContainer, ...mobileStyles.imageContainer }}
      >
        <Box
          sx={{
            textAlign: "center",
            width: "100%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Box sx={{ ...styles.content, ...mobileStyles.content }}>
            <Typography variant="h1" className="font-bold text-white" sx={mobileStyles.typography}>
              The Ultimate AI Agent Platform
            </Typography>
            <Typography
              variant="h5"
              className="font-extrabold text-white"
              sx={{ ...styles.noteTextStyles, ...mobileStyles.noteText }}
            >
              Start earning and owning new Agents now
            </Typography>
            <Button
              variant="contained"
              className="text-black bg-white rounded-xl"
              sx={mobileStyles.button}
              onClick={() => openLink(process.env.NEXT_PUBLIC_REDIRECT_URL)}
            >
              Launch App
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LaunchApp;
