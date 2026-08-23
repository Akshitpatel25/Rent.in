import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useTheme = create(
  devtools(
    persist(
      (set) => ({
        userDetails: null,
        fetchUserDetails: async () => {
          try {
            const url = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
            const res = await fetch(`${url}/api/me`);
            if (res.ok) {
              const data = await res.json();
              set({ userDetails: data.user });
            }
          } catch (error) {
            console.log("error in fetch zustand");
          }
        },
        logoutZustand: async () => set({ userDetails: null }),
      }),
      { name: "userDetails" }
    )
  )
);

export default useTheme;
