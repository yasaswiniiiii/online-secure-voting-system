import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useListVoters, getListVotersQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, CheckCircle2, Clock } from "lucide-react";

export default function AdminVotersPage() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) setLocation("/admin/login");
  }, [isAuthenticated, isAdmin, authLoading, setLocation]);

  const { data: voters, isLoading } = useListVoters({
    query: { enabled: isAuthenticated && isAdmin, queryKey: getListVotersQueryKey() },
  });

  const totalVoted = voters?.filter((v) => v.hasVoted).length ?? 0;
  const totalVoters = voters?.filter((v) => v.voterId !== "admin").length ?? 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Users className="w-7 h-7 text-primary" />
          Registered Voters
        </h1>
        <p className="text-muted-foreground mt-1">All voter accounts in the system</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Voters", value: totalVoters, color: "text-primary" },
          { label: "Voted", value: totalVoted, color: "text-green-600 dark:text-green-400" },
          { label: "Pending", value: totalVoters - totalVoted, color: "text-yellow-600 dark:text-yellow-400" },
        ].map((s) => (
          <Card key={s.label} className="border-border text-center">
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Voter Registry</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voter ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Mobile</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(voters ?? []).filter((v) => v.voterId !== "admin").map((voter) => (
                    <TableRow key={voter.id} data-testid={`row-voter-${voter.id}`}>
                      <TableCell className="font-mono text-sm font-medium">{voter.voterId}</TableCell>
                      <TableCell className="font-medium">{voter.fullName}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{voter.email}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{voter.mobile}</TableCell>
                      <TableCell>
                        {voter.hasVoted ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-800 text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />Voted
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700 text-xs">
                            <Clock className="w-3 h-3 mr-1" />Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                        {new Date(voter.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
