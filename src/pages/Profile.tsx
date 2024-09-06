import { useEffect, useState } from "react";
import Input from "../components/atoms/Input";
import { useAuth } from "../util/useAuth";
import { createOrUpdateKid, getKid, Kid } from "../util/database";

import { enqueueSnackbar } from "notistack";
import { db } from "../firebase";
import { Link } from "react-router-dom";

function Profile() {
  const { user } = useAuth();
  const [kid, setKid] = useState<Kid | null>(null);
  const [kidName, setKidName] = useState("");
  const [newAccessUid, setNewAccessUid] = useState("");

  useEffect(() => {
    const fetchKid = async () => {
      if (user?.uid) {
        try {
          const jo = await getKid(db, user.uid);
          console.log(jo);
          setKid(jo);
        } catch {}
      }
    };

    fetchKid();
  }, [user]);

  const onSave = async () => {
    if (user?.uid) {
      await createOrUpdateKid(db, {
        ...kid,
        name: kidName,
        parents: [user?.uid],
      });
      enqueueSnackbar("Erfolgreich gespeichert.", {
        variant: "success",
      });
      setKid(await getKid(db, user.uid));
    }
  };

  const onAddAccess = async () => {
    if (user?.uid && kid?.id) {
      await createOrUpdateKid(db, {
        ...kid,
        parents: [...kid.parents, newAccessUid],
      });
      enqueueSnackbar("Erfolgreich gespeichert.", {
        variant: "success",
      });
    }
  };

  return (
    <div className="p-8 flex flex-col gap-3 items-center">
      <h2 className="text-3xl">Dein Profil</h2>
      <div>
        Hallo {user?.displayName}.<br />
        Deine Benutzer-ID ist {user?.uid}
      </div>
      <h2 className="text-3xl mt-8">Dein Kind</h2>
      <section className="flex flex-col align-center gap-2">
        <span>Name des Kindes:</span>
        <Input
          placeholder="Name des Kindes"
          value={kidName || kid?.name}
          onChange={(e) => setKidName(e.target.value)}
        />
        {kid?.parents && kid?.parents?.length > 1 ? (
          <ul>
            {kid.parents.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        ) : (
          ""
        )}
        <ul></ul>
        <button onClick={onSave}>Speichern</button>
      </section>
      {kid?.id && (
        <>
          <h2 className="text-3xl mt-8">{kid.name}'s Speiseplan</h2>
          <section className="flex flex-col align-center gap-2">
            <span>Zugang zu {kid.name}'s Speiseplan gewähren:</span>
            <Input
              placeholder="Benutzer-ID des Elternteils"
              value={newAccessUid}
              onChange={(e) => setNewAccessUid(e.target.value)}
            />
            <button onClick={onAddAccess}>Speichern</button>
          </section>
          <Link to={`/einnehmen/${kid.id}`} className="button mt-4">
            Link zu {kid.name}'s Speiseplan
          </Link>
        </>
      )}
    </div>
  );
}

export default Profile;
