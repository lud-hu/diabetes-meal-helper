import { SnackbarProvider } from "notistack";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-tabs/style/react-tabs.css";
import "./App.css";
import Footer from "./components/molecules/Footer";
import Header from "./components/molecules/Header";
import Configuration from "./pages/ConfigureMeal";
import IntakeMeal from "./pages/intakeMeal";

const router = createBrowserRouter([
  {
    path: "/konfigurieren",
    element: <Configuration />,
  },
  {
    path: "/einnehmen",
    element: <IntakeMeal />,
  },
  {
    path: "/",
    element: <IntakeMeal />,
  },
]);

function App() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <SnackbarProvider />
      <RouterProvider router={router} />
      <Footer />
    </div>
  );
}

export default App;
