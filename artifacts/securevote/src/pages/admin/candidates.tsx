import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useListCandidates, useCreateCandidate, useUpdateCandidate, useDeleteCandidate, useListElections, getListCandidatesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserCheck, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCandidatesPage() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", party: "", symbol: "", description: "", imageUrl: "", electionId: "" });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) setLocation("/admin/login");
  }, [isAuthenticated, isAdmin, authLoading, setLocation]);

  const { data: candidates, isLoading } = useListCandidates({ query: { enabled: isAuthenticated && isAdmin, queryKey: getListCandidatesQueryKey() } });
  const { data: elections } = useListElections({ query: { enabled: isAuthenticated && isAdmin } });
  const createMutation = useCreateCandidate();
  const updateMutation = useUpdateCandidate();
  const deleteMutation = useDeleteCandidate();

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", party: "", symbol: "", description: "", imageUrl: "", electionId: elections?.[0]?.id?.toString() ?? "" });
    setOpen(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setForm({ name: c.name, party: c.party, symbol: c.symbol, description: c.description, imageUrl: c.imageUrl ?? "", electionId: c.electionId.toString() });
    setOpen(true);
  };

  const handleSubmit = () => {
    const payload = { ...form, electionId: parseInt(form.electionId, 10) };
    const invalidate = () => queryClient.invalidateQueries({ queryKey: getListCandidatesQueryKey() });
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: payload },
        {
          onSuccess: () => { toast.success("Candidate updated."); setOpen(false); invalidate(); },
          onError: () => toast.error("Failed to update candidate."),
        }
      );
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: () => { toast.success("Candidate added."); setOpen(false); invalidate(); },
          onError: () => toast.error("Failed to add candidate."),
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this candidate?")) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => { toast.success("Candidate deleted."); queryClient.invalidateQueries({ queryKey: getListCandidatesQueryKey() }); },
        onError: () => toast.error("Failed to delete candidate."),
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <UserCheck className="w-7 h-7 text-primary" /> Candidates
          </h1>
          <p className="text-muted-foreground mt-1">Manage election candidates</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-candidate">
          <Plus className="w-4 h-4 mr-2" /> Add Candidate
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      ) : (candidates ?? []).length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No candidates yet</p>
          <Button className="mt-4" onClick={openCreate}>Add First Candidate</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(candidates ?? []).map((c) => (
            <Card key={c.id} className="border-border overflow-hidden" data-testid={`card-admin-candidate-${c.id}`}>
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary/20 relative flex items-center justify-center">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-sidebar/80 flex items-center justify-center text-white text-2xl font-bold">
                    {c.name.charAt(0)}
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-foreground">{c.name}</h3>
                <p className="text-primary text-sm font-medium">{c.party}</p>
                <p className="text-muted-foreground text-xs mt-0.5">Symbol: {c.symbol}</p>
                <p className="text-muted-foreground text-xs mt-2 line-clamp-2">{c.description}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(c)} data-testid={`button-edit-candidate-${c.id}`}>
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(c.id)} className="text-destructive hover:text-destructive" data-testid={`button-delete-candidate-${c.id}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Candidate" : "Add Candidate"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Candidate name" />
              </div>
              <div className="space-y-1.5">
                <Label>Party</Label>
                <Input value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })} placeholder="Party name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Symbol</Label>
                <Input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} placeholder="e.g. Rising Sun" />
              </div>
              <div className="space-y-1.5">
                <Label>Election</Label>
                <Select value={form.electionId} onValueChange={(v) => setForm({ ...form, electionId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select election" /></SelectTrigger>
                  <SelectContent>
                    {(elections ?? []).map((e) => (
                      <SelectItem key={e.id} value={e.id.toString()}>{e.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://... or /candidates/photo.jpg" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Candidate bio and platform" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {editing ? "Save Changes" : "Add Candidate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
