import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useListCandidates, useGetVoteStatus, getGetVoteStatusQueryKey, getListCandidatesQueryKey } from "@workspace/api-client-react";
import { setSelectedCandidate } from "@/hooks/useVote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Vote, CheckCircle2, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function CandidatesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) setLocation("/login");
  }, [isAuthenticated, authLoading, setLocation]);

  const { data: candidates, isLoading } = useListCandidates({ query: { enabled: isAuthenticated, queryKey: getListCandidatesQueryKey() } });
  const { data: voteStatus } = useGetVoteStatus({ query: { enabled: isAuthenticated, queryKey: getGetVoteStatusQueryKey() } });

  const filtered = candidates?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.party.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleVote = (candidate: typeof filtered[0]) => {
    if (voteStatus?.hasVoted) {
      toast.error("You have already cast your vote.");
      return;
    }
    setSelectedCandidate({
      id: candidate.id,
      name: candidate.name,
      party: candidate.party,
      symbol: candidate.symbol,
      imageUrl: candidate.imageUrl,
      electionId: candidate.electionId,
    });
    setLocation("/vote/confirm");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
            <p className="text-muted-foreground mt-1">Review all candidates before casting your vote</p>
          </div>
          {voteStatus?.hasVoted && (
            <Badge className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-800 px-3 py-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Vote Cast — {voteStatus.candidateName}
            </Badge>
          )}
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, party, or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-candidate-search"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No candidates found</p>
          <p className="text-sm mt-1">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((candidate, i) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              data-testid={`card-candidate-${candidate.id}`}
            >
              <Card className="h-full border-border hover:border-primary/40 hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary/20 relative overflow-hidden">
                  {candidate.imageUrl ? (
                    <img
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-sidebar/30">
                    <div className="w-20 h-20 rounded-full bg-sidebar/80 flex items-center justify-center text-white text-3xl font-bold">
                      {candidate.name.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Badge className="bg-sidebar/90 text-white border-0 text-xs">
                      {candidate.symbol}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground leading-tight">{candidate.name}</h3>
                    <p className="text-primary font-medium text-sm mt-0.5">{candidate.party}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{candidate.description}</p>
                  <Button
                    className="w-full"
                    variant={voteStatus?.hasVoted ? "outline" : "default"}
                    onClick={() => handleVote(candidate)}
                    disabled={voteStatus?.hasVoted}
                    data-testid={`button-vote-candidate-${candidate.id}`}
                  >
                    {voteStatus?.hasVoted ? (
                      voteStatus.candidateId === candidate.id ? (
                        <><CheckCircle2 className="w-4 h-4 mr-2" />Your Vote</>
                      ) : "Already Voted"
                    ) : (
                      <><Vote className="w-4 h-4 mr-2" />Vote for {candidate.name.split(" ")[0]}</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
