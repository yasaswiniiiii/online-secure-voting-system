import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useGetAdminStats, useGetActivityLog, getGetAdminStatsQueryKey, getGetActivityLogQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Vote, Trophy, CalendarDays, BarChart3, Shield, UserCheck, List } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) setLocation("/admin/login");
  }, [isAuthenticated, isAdmin, authLoading, setLocation]);

  const { data: stats, isLoading: statsLoading } = useGetAdminStats({
    query: { enabled: isAuthenticated && isAdmin, queryKey: getGetAdminStatsQueryKey() },
  });

  const { data: activity, isLoading: activityLoading } = useGetActivityLog({
    query: { enabled: isAuthenticated && isAdmin, queryKey: getGetActivityLogQueryKey() },
  });

  const adminNav = [
    { href: "/admin/elections", icon: CalendarDays, label: "Elections", desc: "Create and manage elections" },
    { href: "/admin/candidates", icon: UserCheck, label: "Candidates", desc: "Add, edit, and remove candidates" },
    { href: "/admin/voters", icon: Users, label: "Voters", desc: "View all registered voters" },
    { href: "/admin/results", icon: BarChart3, label: "Results", desc: "View detailed election results" },
  ];

  if (authLoading) return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-primary" />
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Admin Portal</Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Election management and oversight</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statsLoading ? (
          Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : stats ? (
          [
            { icon: Users, label: "Total Voters", value: stats.totalVoters, color: "text-blue-600 dark:text-blue-400" },
            { icon: Vote, label: "Votes Cast", value: stats.totalVoted, color: "text-green-600 dark:text-green-400" },
            { icon: Trophy, label: "Candidates", value: stats.totalCandidates, color: "text-yellow-600 dark:text-yellow-400" },
            { icon: CalendarDays, label: "Elections", value: stats.totalElections, color: "text-purple-600 dark:text-purple-400" },
            { icon: BarChart3, label: "Turnout", value: `${stats.votingPercentage}%`, color: "text-primary" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="border-border text-center">
                <CardContent className="p-4">
                  <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : null}
      </div>

      {stats?.activeElection && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-sm">Active Election</p>
              <p className="text-muted-foreground text-xs">{stats.activeElection}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick nav */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <List className="w-4 h-4 text-primary" />
            Management
          </h2>
          {adminNav.map((item, i) => (
            <motion.div key={item.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 + 0.3 }}>
              <Link href={item.href}>
                <Card className="border-border hover:border-primary/40 hover:shadow-sm cursor-pointer transition-all duration-200">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-2">
          <Card className="border-border h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
                </div>
              ) : (activity ?? []).length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No activity logs yet.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {(activity ?? []).slice(0, 20).map((log, i) => (
                    <motion.div
                      key={log.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      data-testid={`activity-log-${log.id}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">{log.action}</Badge>
                          <span className="text-xs text-muted-foreground">{log.userType}</span>
                        </div>
                        <p className="text-sm text-foreground mt-0.5 truncate">{log.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
