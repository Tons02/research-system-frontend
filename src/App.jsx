import { createTheme, ThemeProvider } from "@mui/material"
import { RouterModule } from "./utility/routing/RouterModule"

function App() {
  const theme = createTheme ({
    palette:{
      mode :'light',
      primary: {main:"#3d6662"}
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
