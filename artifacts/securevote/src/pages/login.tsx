import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useLoginVoter } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const schema = z.object({
  identifier: z.string().min(1, "Enter your Voter ID or email"),
  password: z.string().min(1, "Enter your password"),
  rememberMe: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [showPw, setShowPw] = useState(false);
  const mutation = useLoginVoter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: "", password: "", rememberMe: false },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { data: { identifier: data.identifier, password: data.password, rememberMe: data.rememberMe } },
      {
        onSuccess: (res) => {
          toast.info("OTP sent! Check the response message for your OTP.");
          sessionStorage.setItem("sv_pending_voter_id", res.voterId);
          sessionStorage.setItem("sv_otp_hint", res.message);
          setLocation("/verify-otp");
        },
        onError: (err: any) => {
          toast.error(err?.data?.error ?? "Invalid credentials. Please try again.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-sidebar rounded-2xl mb-4 shadow-lg">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Voter Login</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to access the voting portal</p>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <LogIn className="w-5 h-5 text-primary" />
              Sign In
            </CardTitle>
            <CardDescription>Enter your Voter ID or email address to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="identifier" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voter ID or Email</FormLabel>
                    <FormControl>
                      <Input placeholder="V001 or you@email.com" {...field} data-testid="input-identifier" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPw ? "text" : "password"} placeholder="Enter your password" {...field} data-testid="input-password" />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPw(!showPw)}>
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="rememberMe" render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-remember-me" />
                    </FormControl>
                    <FormLabel className="!mt-0 font-normal text-sm cursor-pointer">Remember me</FormLabel>
                  </FormItem>
                )} />

                <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-submit-login">
                  {mutation.isPending ? "Signing In..." : "Continue to OTP Verification"}
                </Button>
              </form>
            </Form>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-center text-xs text-muted-foreground mb-3">Demo credentials</p>
              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                <p><span className="font-medium">Voter:</span> ID: V001, Password: Voter@1234</p>
                <p><span className="font-medium">Admin:</span> <Link href="/admin/login" className="text-primary hover:underline">Use admin login page</Link></p>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              New voter?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
