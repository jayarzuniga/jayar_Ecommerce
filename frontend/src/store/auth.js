import {create} from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import Cookies from "js-cookie";

const useAuthStore = create((set, get) => ({
    allUserData: null,
    loading: false,

    user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
    }),
    
    setUser: (user) => set({ allUserData: user }),
    setLoading: (loading) => set({loading}),
    isLoggedIn: () => {
        const access_token = Cookies.get("access_token");
        const refresh_token = Cookies.get("refresh_token");
        return access_token !== undefined && refresh_token !== undefined;
      },
}))

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('Store', useAuthStore);
}

export {useAuthStore}