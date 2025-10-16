
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
const [me, setMe] = useState(null);
const [loading, setLoading] = useState(true);
const fetched = useRef(false);

async function fetchMe() {
    try {
    const r = await api("/auth/me", { method: "GET", withCred: true });
    setMe(r?.data?.user || r?.user || null);
    } catch {
    setMe(null);
    } finally {
    setLoading(false);
    }
}

async function logout() {
    try {
        await api("/auth/logout", { method: "POST", withCred: true });
    } catch (err) {
        console.error("Logout failed:", err);
    } finally {
        setMe(null); 
    }
}

useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchMe();
}, []);

return (
    <AuthCtx.Provider
    value={{ me, setMe, loading, logout, refetchMe: fetchMe }}
    >
    {children}
    </AuthCtx.Provider>
);
}

export function useAuth() {
return useContext(AuthCtx);
}
