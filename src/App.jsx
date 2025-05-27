import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";

// Liste des chapitres
const chapitre = ["1CH", "2CH", "1KI", "2KI", "1SA", "2SA"];
const ITEM_HEIGHT = 80;

// Composant Menu déroulant
function LongMenu({ setbookCode }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

// Fonction pour gérer l'ouverture du menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

// Fonction pour gérer la fermeture du menu
  const handleClose = () => { 
    setAnchorEl(null); 
  };

// Fonction pour gérer la sélection d'un chapitre
  const handleSelect = (code) => { 
    setbookCode(code);
    handleClose();
  };

// Rendu du menu déroulant
  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick} // Ouvre le menu
        sx={{ color: "white" }}
      >
        <MoreVertIcon />

      </IconButton>

      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose} // Ferme le menu
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          },
        }}
      >
        {chapitre.map((chap) => ( // Itération sur les chapitres pour créer les éléments du menu
          <MenuItem key={chap} onClick={() => handleSelect(chap)}> {/* Affichage du code du chapitre */}
            {chap} 
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

// Composant principal
function App() {
  const [bookCode, setbookCode] = useState("1CH"); // Code du chapitre par défaut
  const [bookImagesInfo, setBookImagesInfo] = useState([]); // Informations sur les images du chapitre
  const [imageN, setImageN] = useState(1); // Numéro de l'image actuellement affichée
// Effet pour charger les données du chapitre sélectionné
  
useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/images/${bookCode}.tsv`); // Requête pour récupérer les données TSV du chapitre sélectionné
        setBookImagesInfo(response.data.split("\n").map((r) => r.split("\t"))); // Transformation des données TSV en tableau
        setImageN(1); // reset to first image when bookCode changes
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

// Appel de la fonction pour charger les données
    fetchData();
  }, [bookCode]);
// Fonction pour gérer le clic sur le bouton "Précédent"
  const handlePrev = () => {
    setImageN((prev) => (prev > 0 ? prev - 1 : 0));
  };

// Fonction pour gérer le clic sur le bouton "Suivant"
  const handleNext = () => {
    setImageN((prev) =>
      prev < bookImagesInfo.length - 1 ? prev + 1 : prev
    );
  };

// Rendu du composant principal
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#222",
        position: "relative",
      }}
    >
      {/* Menu en haut à droite */}
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <LongMenu setbookCode={setbookCode} />
      </Box>

      {/* Affichage du numéro de page */}
      <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
        Page {imageN}
      </Typography>

      {/* Affichage de l'image */}
      {bookImagesInfo[imageN] && (
        <img
          src={`/images${bookImagesInfo[imageN][6].substring(1)}.jpg`}
          alt="Book page"
          style={{
            maxWidth: "90vw",
            maxHeight: "80vh",
            objectFit: "contain",
            display: "block",
            marginBottom: 16,
          }}
        />
      )}

      {/* Boutons navigation */}
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handlePrev} disabled={imageN === 0}>
          ⟨ Précédent
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={imageN >= bookImagesInfo.length - 1}
        >
          Suivant ⟩
        </Button>
      </Stack>
    </Box>
  );
}

export default App;
