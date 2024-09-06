import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../util/useAuth";
import { useEffect, useState } from "react";
import { getKid, Kid } from "../../util/database";
import { db } from "../../firebase";

function Header() {
  const { user, signIn, signOut } = useAuth();
  // TODO: Create Kid Store instead of fetching it here again
  const [kid, setKid] = useState<Kid | null>(null);

  useEffect(() => {
    const fetchKid = async () => {
      if (user?.uid) {
        try {
          const jo = await getKid(db, user.uid);

          setKid(jo);
        } catch {}
      }
    };

    fetchKid();
  }, [user]);

  return (
    <>
      <header className="bg-emerald-600 dark:bg-emerald-800 p-8 text-xl text-white flex justify-between items-center">
        <span>
          <Link to={user ? "/konfigurieren" : "/"}>
            🧸 {kid ? `${kid?.name}'s` : ""} Essenshelfer
          </Link>
        </span>
        <button
          onClick={() => (!user ? signIn() : signOut())}
          className="text-sm"
        >
          {!user ? "Anmelden" : "Abmelden"}
        </button>
      </header>

      {user && (
        <div className="bg-emerald-700 dark:bg-emerald-500 dark:text-black flex">
          {[
            { link: "/konfigurieren", text: "Essensplan" },
            { link: "/profil", text: "Profil" },
          ].map((item) => (
            <NavLink
              to={item.link}
              className={({ isActive }) =>
                `py-2 flex-1 text-center ${isActive ? "font-bold" : ""}`
              }
            >
              {item.text}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}

export default Header;
