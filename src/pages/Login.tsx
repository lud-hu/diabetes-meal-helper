import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../util/useAuth";

function Login() {
  const { user, isLoading, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // If "forward" query parameter was set, navigate to that path after login.
  const forwardTo = searchParams.get("forward");
  if (user && !isLoading) {
    navigate(forwardTo || "/konfigurieren");
  }

  return (
    <div className="p-8 flex flex-col gap-3 items-center">
      Bitte melde dich an, um Änderungen vorzunehmen.
      <button onClick={() => (!user ? signIn() : signOut())}>
        {!user ? "Mit Google anmelden" : "Abmelden"}
      </button>
    </div>
  );
}

export default Login;
