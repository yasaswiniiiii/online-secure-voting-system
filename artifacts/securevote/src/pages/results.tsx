import { useGetResults } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Users, BarChart3, PieChart as PieIcon } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["hsl(211,100%,40%)", "hsl(142,71%,38%)", "hsl(38,92%,50%)", "hsl(280,65%,55%)", "hsl(340,82%,52%)"];

export default function ResultsPage() {
  const { data, isLoading } = useGetResults();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid sm:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-muted-foreground">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">No results available</p>
        <p className="text-sm mt-1">Results will appear once voting has taken place.</p>
      </div>
    );
  }

  const { election, candidates, totalVotes, winner } = data;
  const chartData = candidates.map((c) => ({ name: c.name.split(" ")[0], votes: c.voteCount, party: c.party }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Election Results</h1>
        <p className="text-muted-foreground mt-1">{election.title}</p>
      </div>

      {/* Winner */}
      {totalVotes > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="border-yellow-300 dark:border-yellow-700 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="w-14 h-14 rounded-full bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center shrink-0">
                  <Trophy className="w-7 h-7 text-yellow-700 dark:text-yellow-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 border-0">Leading</Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{winner.name}</h2>
                  <p className="text-muted-foreground text-sm">{winner.party} · {winner.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{winner.voteCount}</p>
                  <p className="text-sm text-muted-foreground">votes ({winner.percentage}%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Votes Cast", value: totalVotes, icon: Users },
          { label: "Candidates", value: candidates.length, icon: BarChart3 },
          { label: "Leading Candidate", value: winner.name.split(" ")[0], icon: Trophy },
          { label: "Leader's Share", value: `${winner.percentage}%`, icon: PieIcon },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="border-border text-center">
              <CardContent className="p-4">
                <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Votes by Candidate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "600" }}
                  formatter={(val, _, props) => [`${val} votes`, props.payload.party]}
                />
                <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-primary" />
              Vote Share
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={candidates.map((c) => ({ name: c.name.split(" ")[0], value: c.voteCount }))}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {candidates.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                  formatter={(val) => [`${val} votes`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Candidate breakdown */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {candidates.map((c, i) => (
            <div key={c.id} className="space-y-1.5" data-testid={`result-candidate-${c.id}`}>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className="text-muted-foreground text-xs hidden sm:inline">· {c.party}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs">{c.voteCount} votes</span>
                  <span className="font-semibold text-foreground w-12 text-right">{c.percentage}%</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${c.percentage}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
