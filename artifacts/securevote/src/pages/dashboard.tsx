import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useGetActiveElection, useGetVoteStatus, useListCandidates, getGetVoteStatusQueryKey, getGetActiveElectionQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Vote, Users, CheckCircle2, Clock, ArrowRight, ShieldCheck, CalendarDays, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Election ended"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [endDate]);

  return <span className="font-mono text-primary font-semibold">{timeLeft}</span>;
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) setLocation("/login");
  }, [isAuthenticated, authLoading, setLocation]);

  const { data: election, isLoading: electionLoading } = useGetActiveElection({
    query: { enabled: isAuthenticated, queryKey: getGetActiveElectionQueryKey() },
  });

  const { data: voteStatus, isLoading: statusLoading } = useGetVoteStatus({
    query: { enabled: isAuthenticated, queryKey: getGetVoteStatusQueryKey() },
  });

  const { data: candidates } = useListCandidates({ query: { enabled: isAuthenticated } });

  if (authLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Welcome */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.fullName?.split(" ")[0]}</h1>
            <p className="text-muted-foreground mt-1">Voter ID: <span className="font-mono font-medium text-foreground">{user?.voterId}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Secure Portal</span>
          </div>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          {
            icon: Vote,
            label: "Your Vote Status",
            value: voteStatus?.hasVoted ? "Vote Cast" : "Not Voted",
            color: voteStatus?.hasVoted ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400",
            bg: voteStatus?.hasVoted ? "bg-green-50 dark:bg-green-950/30" : "bg-yellow-50 dark:bg-yellow-950/30",
          },
          {
            icon: Users,
            label: "Total Candidates",
            value: candidates?.length?.toString() ?? "—",
            color: "text-primary",
            bg: "bg-primary/5",
          },
          {
            icon: CalendarDays,
            label: "Election Status",
            value: election?.status ? election.status.charAt(0).toUpperCase() + election.status.slice(1) : (electionLoading ? "Loading..." : "No Election"),
            color: election?.status === "active" ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
            bg: election?.status === "active" ? "bg-green-50 dark:bg-green-950/30" : "bg-muted/50",
          },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className={`border-border ${card.bg} overflow-hidden`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background/60 flex items-center justify-center shrink-0">
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{card.label}</p>
                    <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Election Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Current Election
              </CardTitle>
            </CardHeader>
            <CardContent>
              {electionLoading ? (
                <div className="space-y-2"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-full" /></div>
              ) : election ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{election.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{election.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Time Remaining</p>
                      {election.endDate && <CountdownTimer endDate={election.endDate} />}
                    </div>
                    <Badge variant={election.status === "active" ? "default" : "secondary"}>
                      {election.status}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-muted-foreground py-4">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">No active election at this time.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Vote CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-border h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Vote className="w-4 h-4 text-primary" />
                Voting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {voteStatus?.hasVoted ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-300 text-sm">Vote successfully cast</p>
                      {voteStatus.candidateName && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">You voted for: {voteStatus.candidateName}</p>
                      )}
                    </div>
                  </div>
                  <Link href="/results">
                    <Button variant="outline" className="w-full" data-testid="button-view-results">
                      View Election Results <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You have not yet cast your vote. Review the candidates and make your voice heard.
                    <strong className="text-foreground"> Your vote cannot be changed once cast.</strong>
                  </p>
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">Vote before the election closes. Each voter may cast exactly one vote.</p>
                  </div>
                  <Link href="/candidates">
                    <Button className="w-full" disabled={!election || election.status !== "active"} data-testid="button-vote-now">
                      {election?.status === "active" ? "Browse Candidates & Vote" : "Voting Not Open"} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
