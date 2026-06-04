import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useVerifyOtp, useResendOtp } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ShieldCheck, RefreshCw, Clock } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function VerifyOtpPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

  const voterId = sessionStorage.getItem("sv_pending_voter_id") ?? "";
  const otpHint = sessionStorage.getItem("sv_otp_hint") ?? "";

  useEffect(() => {
    if (!voterId) {
      setLocation("/login");
    }
  }, [voterId, setLocation]);

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleVerify = useCallback(() => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }
    verifyMutation.mutate(
      { data: { voterId, otp } },
      {
        onSuccess: (res) => {
          login(res.token);
          sessionStorage.removeItem("sv_pending_voter_id");
          sessionStorage.removeItem("sv_otp_hint");
          toast.success("Identity verified! Welcome to SecureVote.");
          setLocation("/dashboard");
        },
        onError: (err: any) => {
          toast.error(err?.data?.error ?? "Invalid OTP. Please try again.");
          setOtp("");
        },
      }
    );
  }, [otp, voterId, verifyMutation, login, setLocation]);

  const handleResend = () => {
    resendMutation.mutate(
      { data: { voterId } },
      {
        onSuccess: (res) => {
          toast.success("New OTP sent!");
          toast.info(res.message);
          setCountdown(60);
          setCanResend(false);
          setOtp("");
        },
        onError: () => {
          toast.error("Failed to resend OTP.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-sidebar rounded-2xl mb-4 shadow-lg">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verify Your Identity</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter the 6-digit OTP to continue</p>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-lg">OTP Verification</CardTitle>
            <CardDescription>
              A one-time password has been sent for voter <strong className="text-foreground">{voterId}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {otpHint && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm text-primary text-center">
                <strong>Demo OTP hint:</strong> {otpHint}
              </div>
            )}

            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp} data-testid="input-otp">
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {canResend ? (
                <span>OTP expired</span>
              ) : (
                <span>OTP expires in <strong className="text-foreground">{countdown}s</strong></span>
              )}
            </div>

            <Button
              className="w-full"
              onClick={handleVerify}
              disabled={verifyMutation.isPending || otp.length !== 6}
              data-testid="button-verify-otp"
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify & Sign In"}
            </Button>

            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={!canResend || resendMutation.isPending}
                className="text-muted-foreground hover:text-primary"
                data-testid="button-resend-otp"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {resendMutation.isPending ? "Sending..." : "Resend OTP"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
