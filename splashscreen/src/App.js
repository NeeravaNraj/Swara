import "./App.css";
import { LinearProgress, ThemeProvider, createTheme } from "@mui/material";
import { orange } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: orange[500],
    },
  },
});

function App() {
  return (
    <div className="App">
      <img
        src="https://i.postimg.cc/PrPqsBCj/Sw-ara-transparent.png"
        className="swara-img"
        alt=""
      />
      <ThemeProvider theme={theme}>
        <LinearProgress className="linear-progress" />
      </ThemeProvider>
      <p className="author-text">Made by Neerava and team.</p>
      <p className="email">Email: neerava.nraj@gmail.com</p>
    </div>
  );
}

export default App;
