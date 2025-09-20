import { useEffect, useState } from "react";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebaseConfig";

interface IUser {
  firebaseUid: string;
  email?: string;
  displayName?: string;
  favorites: string[];
  cooltimeSeconds: number;
}

const MyPage = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const token = await getIdToken(firebaseUser);
          const res = await fetch("/api/cooltime/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) {
            const text = await res.text();
            console.error("Server response error:", res.status, text);
            setUser(null);
          } else {
            const data = await res.json();
            setUser(data);
          }
        } catch (err) {
          console.error("Fetch error:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Page</h1>
      {user ? (
        <>
          <p>Name: {user.displayName}</p>
          <p>Email: {user.email}</p>
          <p>Favorites: {user.favorites.join(", ")}</p>
          <p>Cooltime: {user.cooltimeSeconds}초</p>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
};

export default MyPage;
