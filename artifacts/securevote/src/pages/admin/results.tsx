import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useGetResults } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Trophy, Users, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const COLORS = ["hsl(211,100%,40%)", "hsl(142,71%,38%)", "hsl(38,92%,50%)", "hsl(280,65%,55%)", "hsl(340,82%,52%)"];

export default function AdminResultsPage() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) setLocation("/admin/login");
  }, [isAuthenticated, isAdmin, authLoading, setLocation]);

  const { data, isLoading } = useGetResults({ query: { enabled: isAuthenticated && isAdmin } });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-primary" /> Election Results
        </h1>
        <p className="text-muted-foreground mt-1">Admin view — detailed results breakdown</p>
      </div>

      {!data ? (
        <div className="text-center py-20 text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No election results available.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Votes", value: data.totalVotes, icon: Users, color: "text-primary" },
              { label: "Candidates", value: data.candidates.length, icon: Trophy, color: "text-yellow-600 dark:text-yellow-400" },
              { label: "Leading", value: data.winner.name.split(" ")[0], icon: Trophy, color: "text-green-600 dark:text-green-400" },
              { label: "Leader %", value: `${data.winner.percentage}%`, icon: BarChart3, color: "text-purple-600 dark:text-purple-400" },
            ].map((s) => (
              <Card key={s.label} className="border-border text-center">
                <CardContent className="p-4">
                  <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader className="pb-3"><CardTitle className="text-base">Vote Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={data.candidates.map((c) => ({ name: c.name.split(" ")[0], votes: c.voteCount }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                    <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                      {data.candidates.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3"><CardTitle className="text-base">Detailed Breakdown</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {data.candidates.map((c, i) => (
                  <div key={c.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="font-medium text-foreground">{c.name}</span>
                        {c.id === data.winner.id && <Badge className="text-xs px-1.5 py-0 h-4 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">Leading</Badge>}
                      </div>
                      <span className="font-bold text-foreground">{c.voteCount} <span className="text-muted-foreground font-normal text-xs">({c.percentage}%)</span></span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${c.percentage}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
