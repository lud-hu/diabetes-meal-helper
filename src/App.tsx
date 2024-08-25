import { SnackbarProvider } from "notistack";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-tabs/style/react-tabs.css";
import "./App.css";
import Footer from "./components/molecules/Footer";
import Header from "./components/molecules/Header";
import Configuration from "./pages/ConfigureMeal";
import IntakeMeal from "./pages/intakeMeal";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="flex flex-col h-full">
      <BrowserRouter>
        <Header />
        <SnackbarProvider />
        <Routes>
          <Route
            path="/konfigurieren"
            element={
              <ProtectedRoute>
                <Configuration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/einnehmen" element={<IntakeMeal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<IntakeMeal />} />
          <Route path="/loggedout" element={<div>bye.</div>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
