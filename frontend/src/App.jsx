import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AlertProvider } from "./context/AlertContext";
import "./App.css";

function App() {
  return (
    <AlertProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AlertProvider>
  );
}

export default App;