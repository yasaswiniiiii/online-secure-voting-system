import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useGetVoteStatus, getGetVoteStatusQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) setLocation("/login");
  }, [isAuthenticated, authLoading, setLocation]);

  const { data: voteStatus } = useGetVoteStatus({
    query: { enabled: isAuthenticated, queryKey: getGetVoteStatusQueryKey() },
  });

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Your voter account details</p>
      </div>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border overflow-hidden">
            <div className="bg-sidebar p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                {user?.fullName?.charAt(0) ?? "V"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user?.fullName}</h2>
                <p className="text-sidebar-foreground/70 text-sm">Registered Voter</p>
              </div>
              <div className="ml-auto">
                <Badge className="bg-primary/30 text-white border-primary/50">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  {user?.role}
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {[
                  { icon: User, label: "Voter ID", value: user?.voterId, mono: true },
                  { icon: User, label: "Full Name", value: user?.fullName },
                  { icon: Mail, label: "Email Address", value: user?.email },
                  { icon: Phone, label: "Mobile Number", value: user?.mobile },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{item.label}</p>
                      <p className={`font-medium text-foreground mt-0.5 ${item.mono ? "font-mono" : ""}`}>{item.value ?? "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Voting Status</CardTitle>
            </CardHeader>
            <CardContent>
              {voteStatus?.hasVoted ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-700 dark:text-green-300">Vote Cast Successfully</p>
                    {voteStatus.candidateName && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">You voted for: {voteStatus.candidateName}</p>
                    )}
                    {voteStatus.timestamp && (
                      <p className="text-xs text-green-600/70 dark:text-green-500 mt-0.5">
                        At: {new Date(voteStatus.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-700 dark:text-yellow-300">Vote Not Yet Cast</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-0.5">You have not voted in the current election yet.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
