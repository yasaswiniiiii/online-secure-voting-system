import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useLoginAdmin } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ShieldCheck, KeyRound, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const schema = z.object({
  username: z.string().min(1, "Enter your admin username"),
  password: z.string().min(1, "Enter your password"),
});
type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [showPw, setShowPw] = useState(false);
  const mutation = useLoginAdmin();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { data },
      {
        onSuccess: (res) => {
          login(res.token);
          toast.success("Admin access granted.");
          setLocation("/admin/dashboard");
        },
        onError: (err: any) => {
          toast.error(err?.data?.error ?? "Invalid admin credentials.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-lg">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-sidebar-foreground/60 text-sm mt-1">Authorized personnel only</p>
        </div>

        <Card className="shadow-2xl border-sidebar-border bg-sidebar-accent/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <KeyRound className="w-5 h-5 text-primary" />
              Administrator Sign In
            </CardTitle>
            <CardDescription className="text-sidebar-foreground/60">Enter your admin credentials to access the control panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="username" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sidebar-foreground/80">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} className="bg-sidebar-accent border-sidebar-border text-white placeholder:text-sidebar-foreground/30" data-testid="input-admin-username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sidebar-foreground/80">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPw ? "text" : "password"}
                          placeholder="Enter admin password"
                          {...field}
                          className="bg-sidebar-accent border-sidebar-border text-white placeholder:text-sidebar-foreground/30"
                          data-testid="input-admin-password"
                        />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-sidebar-foreground/50 hover:text-white" onClick={() => setShowPw(!showPw)}>
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white mt-2" disabled={mutation.isPending} data-testid="button-admin-login">
                  {mutation.isPending ? "Authenticating..." : "Access Admin Panel"}
                </Button>
              </form>
            </Form>

            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-xs text-sidebar-foreground/60 text-center">
              Demo: username <strong className="text-primary">admin</strong>, password <strong className="text-primary">admin123</strong>
            </div>

            <p className="text-center text-sm text-sidebar-foreground/50 mt-4">
              <Link href="/login" className="hover:text-primary transition-colors">Voter login</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
