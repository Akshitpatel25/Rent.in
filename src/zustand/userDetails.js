import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "axios";

const useTheme = create(
  devtools(
    persist(
      (set) => ({
        userDetails: null,
        fetchUserDetails: async () => {
          try {
            const url = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
            const res = axios.get(`${url}/api/me`);
            // console.log("calling from zustand");
            res.then((res) => {
              if (res.status == 200) {
                set({ userDetails: res.data.user });
              }
            });
          } catch (error) {
            console.log("error in fetch zustand")
          }
        },
        logoutZustand: async() => set({ userDetails: null }),
        // toggleTheme: () => set((state) => ({ theme: !state.theme })) // Fixed function name
      }),
      { name: "userDetails" } // Store to local storage using this name
    )
  )
);

export default useTheme;
