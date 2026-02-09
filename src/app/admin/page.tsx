"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminPage() {
  const { user, token, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (token && user?.role === "admin") {
      fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => { if (d.users) setUsers(d.users); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [token, user]);

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
              <p className="text-sm text-muted-foreground">Admins</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "user").length}</div>
              <p className="text-sm text-muted-foreground">Regular Users</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading users...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Email</th>
                      <th className="pb-2 font-medium">Role</th>
                      <th className="pb-2 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b last:border-0">
                        <td className="py-2">{u.name}</td>
                        <td className="py-2 text-muted-foreground">{u.email}</td>
                        <td className="py-2">
                          <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="py-2 text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
