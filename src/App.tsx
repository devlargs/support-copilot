import SupportPage from "./pages/SupportPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import { QueryProvider } from "./providers/QueryProvider";

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <SupportPage />
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
