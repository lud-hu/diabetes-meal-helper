import "./App.css";
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
    <>
      <Header />
      <div className="p-8">
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
