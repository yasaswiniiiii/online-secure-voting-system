import { useState, useEffect } from "react";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const TOKEN_KEY = "sv_token";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useGetMe({
    query: {
      enabled: !!token,
      queryKey: getGetMeQueryKey(),
      retry: 1,
    },
  });

  useEffect(() => {
    if (!token) {
      queryClient.removeQueries({ queryKey: getGetMeQueryKey() });
    }
  }, [token, queryClient]);

  const login = (newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    queryClient.clear();
  };

  return {
    token,
    user: user ?? null,
    isLoading: !!token && isLoading,
    isAuthenticated: !!token && !!user,
    isAdmin: !!user && user.role === "admin",
    login,
    logout,
  };
}
