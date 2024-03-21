import "./App.css";
import Footer from "./components/molecules/Footer";
import Header from "./components/molecules/Header";
import Configuration from "./pages/ConfigureMeal";
import IntakeMeal from "./pages/intakeMeal";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
      <div className="p-8 flex-1">
        <RouterProvider router={router} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
