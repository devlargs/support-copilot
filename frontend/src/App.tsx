import SupportPage from "./pages/SupportPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <ThemeProvider>
      <SupportPage />
      <ThemeToggle />
    </ThemeProvider>
  );
}

export default App;
