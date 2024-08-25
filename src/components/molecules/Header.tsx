import { Link } from "react-router-dom";
import { useAuth } from "../../util/useAuth";

function Header() {
  const { user, signIn, signOut } = useAuth();

  return (
    <header className="bg-emerald-600 dark:bg-emerald-800 p-8 text-2xl text-white flex justify-between">
      <span>
        <Link to={user ? "/konfigurieren" : "/"}>🧸 Theo's Essenshelfer</Link>
      </span>
      <div className="text-base">
        {user && <Link to="/profil">Profil</Link>}
        <button onClick={() => (!user ? signIn() : signOut())} className="ml-2">
          {!user ? "Anmelden" : "Abmelden"}
        </button>
      </div>
    </header>
  );
}

export default Header;
