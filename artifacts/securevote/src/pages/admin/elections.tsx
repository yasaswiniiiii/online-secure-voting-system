import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useListElections, useCreateElection, useUpdateElection, useDeleteElection, getListElectionsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarDays, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminElectionsPage() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", startDate: "", endDate: "", status: "upcoming" });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) setLocation("/admin/login");
  }, [isAuthenticated, isAdmin, authLoading, setLocation]);

  const { data: elections, isLoading } = useListElections({
    query: { enabled: isAuthenticated && isAdmin, queryKey: getListElectionsQueryKey() },
  });
  const createMutation = useCreateElection();
  const updateMutation = useUpdateElection();
  const deleteMutation = useDeleteElection();

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", description: "", startDate: "", endDate: "", status: "upcoming" });
    setOpen(true);
  };

  const openEdit = (election: any) => {
    setEditing(election);
    setForm({ title: election.title, description: election.description, startDate: election.startDate, endDate: election.endDate, status: election.status });
    setOpen(true);
  };

  const handleSubmit = () => {
    const invalidate = () => queryClient.invalidateQueries({ queryKey: getListElectionsQueryKey() });
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: form },
        {
          onSuccess: () => { toast.success("Election updated."); setOpen(false); invalidate(); },
          onError: () => toast.error("Failed to update election."),
        }
      );
    } else {
      createMutation.mutate(
        { data: form },
        {
          onSuccess: () => { toast.success("Election created."); setOpen(false); invalidate(); },
          onError: () => toast.error("Failed to create election."),
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this election? This cannot be undone.")) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => { toast.success("Election deleted."); queryClient.invalidateQueries({ queryKey: getListElectionsQueryKey() }); },
        onError: () => toast.error("Failed to delete election."),
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <CalendarDays className="w-7 h-7 text-primary" /> Elections
          </h1>
          <p className="text-muted-foreground mt-1">Create and manage elections</p>
        </div>
        <Button onClick={openCreate} data-testid="button-create-election">
          <Plus className="w-4 h-4 mr-2" /> New Election
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
      ) : (elections ?? []).length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No elections yet</p>
          <Button className="mt-4" onClick={openCreate}>Create First Election</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {(elections ?? []).map((election) => (
            <Card key={election.id} className="border-border" data-testid={`card-election-${election.id}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{election.title}</h3>
                      <Badge variant={election.status === "active" ? "default" : "secondary"} className="text-xs capitalize">{election.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{election.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Start: <strong className="text-foreground">{election.startDate}</strong></span>
                      <span>End: <strong className="text-foreground">{election.endDate}</strong></span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(election)} data-testid={`button-edit-election-${election.id}`}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(election.id)} className="text-destructive hover:text-destructive" data-testid={`button-delete-election-${election.id}`}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Election" : "Create Election"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Election title" data-testid="input-election-title" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Election description" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {editing ? "Save Changes" : "Create Election"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
