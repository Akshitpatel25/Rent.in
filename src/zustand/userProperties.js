import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useProperties = create(
  devtools(
    persist(
      (set) => ({
        userProperties: null,
        fetchUserProperties: async (email) => {
          try {
            const url = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
            const res = await fetch(`${url}/api/getAPIs/all-properties`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            if (res.ok) {
              const data = await res.json();
              set({ userProperties: data.data });
            }
          } catch (error) {
            console.log("error in properties fetching in zustand");
          }
        },
        RemovePropertiesZustand: async () => set({ userProperties: null }),
      }),
      { name: "userProperties" }
    )
  )
);

export default useProperties;
