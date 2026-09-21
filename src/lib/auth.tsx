import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export type AppRole = "farmer" | "buyer" | "admin";

export type CurrentUser = {
  id: string;
  email: string | null;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  suspended: boolean;
  role: AppRole | null;
};

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}

export function useCurrentUser() {
  const { session, loading } = useSession();
  const userId = session?.user.id ?? null;

  const query = useQuery({
    queryKey: ["current-user", userId],
    enabled: !!userId,
    queryFn: async (): Promise<CurrentUser | null> => {
      if (!userId) return null;
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, phone, avatar_url, suspended")
          .eq("id", userId)
          .maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);

      const roleList = (roles ?? []).map((r) => r.role as AppRole);
      const role: AppRole | null = roleList.includes("admin")
        ? "admin"
        : (roleList[0] ?? null);

      return {
        id: userId,
        email: session?.user.email ?? null,
        fullName: profile?.full_name || (session?.user.email ?? "Member"),
        phone: profile?.phone ?? null,
        avatarUrl: profile?.avatar_url ?? null,
        suspended: profile?.suspended ?? false,
        role,
      };
    },
  });

  return {
    user: query.data ?? null,
    isLoading: loading || (!!userId && query.isLoading),
    isAuthenticated: !!userId,
  };
}

export function dashboardPathFor(role: AppRole | null | undefined) {
  if (role === "farmer") return "/farmer";
  if (role === "admin") return "/admin";
  return "/buyer";
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
  };
}
