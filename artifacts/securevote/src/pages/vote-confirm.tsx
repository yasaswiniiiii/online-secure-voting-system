import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useVote } from "@/hooks/useVote";
import { useCastVote, getGetVoteStatusQueryKey, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Vote, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function VoteConfirmPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { selectedCandidate } = useVote();
  const mutation = useCastVote();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) setLocation("/login");
  }, [isAuthenticated, authLoading, setLocation]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && !selectedCandidate) {
      setLocation("/candidates");
    }
  }, [selectedCandidate, authLoading, isAuthenticated, setLocation]);

  if (!selectedCandidate) return null;

  const handleConfirm = () => {
    mutation.mutate(
      { data: { candidateId: selectedCandidate.id, electionId: selectedCandidate.electionId } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetVoteStatusQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          setLocation("/vote/success");
        },
        onError: (err: any) => {
          toast.error(err?.data?.error ?? "Failed to cast vote. Please try again.");
          setLocation("/candidates");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-destructive/20 shadow-xl overflow-hidden">
            <div className="bg-destructive/5 border-b border-destructive/10 p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <p className="text-sm font-semibold text-destructive">This action cannot be changed</p>
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Confirm Your Vote</CardTitle>
              <p className="text-muted-foreground text-sm">
                Are you sure you want to cast your vote? Once submitted, your selection is final and cannot be reversed.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Candidate card */}
              <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-sidebar/20 flex items-center justify-center text-primary text-2xl font-bold overflow-hidden shrink-0">
                    {selectedCandidate.imageUrl ? (
                      <img src={selectedCandidate.imageUrl} alt={selectedCandidate.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      selectedCandidate.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{selectedCandidate.name}</h3>
                    <p className="text-primary font-medium text-sm">{selectedCandidate.party}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Symbol: {selectedCandidate.symbol}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm text-yellow-700 dark:text-yellow-300">
                <p className="font-semibold mb-1">Important Notice</p>
                <p className="leading-relaxed">Your vote will be encrypted and recorded permanently. You cannot vote again or change your selection after confirming.</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Your vote is anonymous and cryptographically secured</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/candidates")}
                  disabled={mutation.isPending}
                  data-testid="button-back-candidates"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={mutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-confirm-vote"
                >
                  {mutation.isPending ? "Casting..." : (
                    <><Vote className="w-4 h-4 mr-2" />Confirm Vote</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
