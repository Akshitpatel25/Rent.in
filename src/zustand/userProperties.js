import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "axios";

const useProperties = create(
  devtools(
    persist(
      (set) => ({
        userProperties: null,
        fetchUserProperties: async (email) => {
          try {
            const url = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
            const res = axios.post(`${url}/api/getAPIs/all-properties`, {email: email});
            // console.log("calling from properties zustand", email);
            res.then((res) => {
              if (res.status == 200) {
                set({ userProperties: res.data.data });
              }
            });
          } catch (error) {
            console.log("error in properties fetching in zustand")
          }
        },
        RemovePropertiesZustand: async() => set({ userProperties: null }),
      }),
      { name: "userProperties" } // Store to local storage using this name
    )
  )
);

export default useProperties;
