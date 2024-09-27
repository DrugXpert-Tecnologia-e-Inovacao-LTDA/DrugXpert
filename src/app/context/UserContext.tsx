import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/lib/actions/user.actions";

interface User {
  firstName: string;
  lastName: string;
  photo: string;
  jobTitle: string;
  userBio: string;
}

const defaultUser: User = {
  firstName: "Anonymous",
  lastName: "",
  photo: "/images/user/user-01.png",
  jobTitle: "Guest",
  userBio: "",
};


const UserContext = createContext<User>(defaultUser);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User>(defaultUser);

  const fetchUser = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const fetchedUser = await getUserByEmail(session.user.email);
        setUser({
          firstName: fetchedUser?.firstName ?? "Anonymous",
          lastName: fetchedUser?.lastName ?? "",
          photo: fetchedUser?.photo ?? "/images/user/user-01.png",
          jobTitle: fetchedUser?.jobTitle ?? "Guest",
          userBio: fetchedUser?.userBio ?? "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
  }, [session?.user?.email]);


  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};


export const useUser = () => useContext(UserContext);
