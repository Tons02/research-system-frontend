import { createTheme, ThemeProvider } from "@mui/material"
import { RouterModule } from "./utility/routing/RouterModule"

function App() {
  const theme = createTheme ({
    palette:{
      mode :'light',
      primary: {
        main: '#3d6662',
        contrastText: '#fff',
    },
    secondary: {
        light: '#55dab3',
        main: '#00a883',
        dark: '#007856',
        contrastText: '#000',
    }
    }
  })

  return (
    <>
      <ThemeProvider theme={theme}>
       <RouterModule />
      </ThemeProvider>
    </>
  )
}

export default App
