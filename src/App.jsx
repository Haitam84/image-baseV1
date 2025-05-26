import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import axios from "axios";

function App() {
  const [bookImagesInfo, setBookImagesInfo] = useState([]);
  const [imageN, setImageN] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/images/1CH.tsv");
        setBookImagesInfo(response.data.split("\n").map((r) => r.split("\t")));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh", // Prend toute la hauteur de la fenêtre
        width: "100vw", // Prend toute la largeur
        display: "flex",
        flexDirection: "column", // Empile verticalement
        justifyContent: "center", // Centre verticalement
        alignItems: "center", // Centre horizontalement
        bgcolor: "#222", // Fond sombre (optionnel)
        boxSizing: "border-box", // Pour éviter les débordements
        padding: 0,
        margin: 0,
      }}
    >
      <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
        Page {imageN}
      </Typography>

      {bookImagesInfo[imageN] && (
        <img
          src={`/images${bookImagesInfo[imageN][6].substring(1)}.jpg`}
          alt="Book page"
          style={{
            maxWidth: "90vw",
            maxHeight: "80vh",
            objectFit: "contain",
            display: "block",
          }}
        />
      )}
    </Box>
  );
}

export default App;
