import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import { Navigate, useNavigate } from 'react-router-dom';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BasicCard({icon, title, subtitle, destination}) {

const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(destination); // Replace "/company" with your desired route
  };
  return (
    <Card
        onClick={handleCardClick}
        sx={{
        maxWidth: 275,
        cursor: "pointer",
        transition: "all 0.3s ease", // Smooth transition for color change
        "&:hover": {
            backgroundColor: "#1cb7ff", // Change the background color on hover
            color: "white", // Change the text color when hovered
        },
        }}
    >
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {icon}
        </Typography>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2">
             {subtitle}
        </Typography>
      </CardContent>
      <CardActions
      sx={{
        paddingRight: 3,
        paddingBottom: 2,
        justifyContent: "flex-end", // Aligns content to the right
      }}
      >
        <EastOutlinedIcon />
      </CardActions>
    </Card>
  );
}