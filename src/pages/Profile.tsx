import { useAuth } from "../util/useAuth";

function Profile() {
  const { user } = useAuth();
  return (
    <>
      <div>Hallo {user?.displayName}</div>
    </>
  );
}

export default Profile;
