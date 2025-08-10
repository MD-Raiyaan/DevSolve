import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { toast } from "react-toast";
import { ID, AppwriteException } from "node-appwrite";
import { account } from "@/models/client/config";

export const useAuthStore = create(
  persist(
    immer((set) => ({
      session: null,
      user: null,
      jwt: null,
      hydrated: null,
      verified: false,

      setVerified: () => {
        set({ verified: true });
      },

      setHydrated: () => {
        set({ hydrated: true });
      },

      verifySession: async () => {
        try {
          const session = await account.getSession("current");
          set({ session });
        } catch (error) {
          console.log(error);
        }
      },

      login: async (email, password) => {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          let user = await account.get();
          const jwt = await account.createJWT();

          if (user.prefs?.reputation === undefined) {
            await account.updatePrefs({ reputation: 0 });
            user = await account.get();
          }

          set({ session, user, jwt });
          set({verified:user.emailVerification})

          toast.success("Logged in successfully !!!");

          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error?.message || "Unknown error",
          };
        }
      },

      logout: async () => {
        try {
          await account.deleteSessions();
          set({ user: null, session: null, jwt: null });
          toast.success("Logged out successfully !!!");
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },

      createAccount: async (name, email, password) => {
        try {
          await account.create(ID.unique(), email, password, name);
          toast.success("Signed up successfully !!!");
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error?.message || "Unknown error",
          };
        }
      },
    })),
    {
      name: "Auth",
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        jwt: state.jwt,
        verified: state.verified,
      }),
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (!error) {
            state?.setHydrated();
          }
        };
      },
    }
  )
);
