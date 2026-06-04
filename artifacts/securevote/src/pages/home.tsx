import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, Vote, BarChart3, Users, Globe, CheckCircle2, ArrowRight, Fingerprint, Eye, Clock } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function HomePage() {
  const features = [
    { icon: ShieldCheck, title: "Military-Grade Security", desc: "JWT authentication and bcrypt password hashing protect every voter account." },
    { icon: Lock, title: "OTP Verification", desc: "Two-factor authentication via one-time passwords ensures only verified voters cast ballots." },
    { icon: Vote, title: "One Voter, One Vote", desc: "Cryptographic safeguards guarantee each eligible voter can only vote once." },
    { icon: BarChart3, title: "Real-Time Results", desc: "Live vote tallies with visual charts available immediately after polling closes." },
    { icon: Users, title: "Accessible to All", desc: "Responsive design works on any device — desktop, tablet, or mobile phone." },
    { icon: Globe, title: "Transparent Process", desc: "Complete audit logs and open result publication ensure full accountability." },
  ];

  const steps = [
    { icon: Fingerprint, step: "01", title: "Register", desc: "Create your voter account with a unique Voter ID and personal details." },
    { icon: Lock, step: "02", title: "Verify Identity", desc: "Confirm your identity with a secure 6-digit OTP sent to your account." },
    { icon: Vote, step: "03", title: "Cast Your Vote", desc: "Review candidates and cast your single, secure, anonymous vote." },
    { icon: Eye, step: "04", title: "View Results", desc: "Watch the live results with detailed charts and winner announcements." },
  ];

  const stats = [
    { value: "256-bit", label: "Encryption" },
    { value: "100%", label: "Audit Trail" },
    { value: "99.9%", label: "Uptime" },
    { value: "Zero", label: "Duplicate Votes" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-sidebar text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar to-primary/20 pointer-events-none" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
              <Badge className="bg-primary/20 text-primary-foreground border-primary/30 mb-6 px-4 py-1.5 text-sm font-medium">
                Educational Prototype — Secure Voting Demo
              </Badge>
            </motion.div>
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              initial="hidden" animate="visible" custom={1} variants={fadeUp}
            >
              Secure<span className="text-primary">Vote</span>
            </motion.h1>
            <motion.p
              className="text-xl sm:text-2xl text-white/70 mb-4 max-w-2xl mx-auto leading-relaxed"
              initial="hidden" animate="visible" custom={2} variants={fadeUp}
            >
              A trusted, transparent, and tamper-proof online voting platform built for modern democracy.
            </motion.p>
            <motion.p
              className="text-sm text-white/50 mb-10"
              initial="hidden" animate="visible" custom={3} variants={fadeUp}
            >
              Community service educational project demonstrating secure digital voting
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial="hidden" animate="visible" custom={4} variants={fadeUp}
            >
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 text-base shadow-lg" data-testid="button-register-hero">
                  Register to Vote <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white/20 text-white bg-white/10 hover:bg-white/20 font-semibold px-8 py-3 text-base" data-testid="button-login-hero">
                  Voter Login
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={s.label} className="text-center" initial="hidden" animate="visible" custom={i + 5} variants={fadeUp}>
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-white/50 uppercase tracking-widest mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Built for Security, Designed for Trust</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Every component of SecureVote has been designed with security and transparency at its core.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Card className="h-full border-border hover:border-primary/40 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Four simple steps to exercise your democratic right.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.step} className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <div className="relative inline-flex mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-sidebar text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why Digital Voting?</h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Online voting eliminates geographical barriers, reduces administrative costs, and increases participation — all while maintaining the highest standards of security.
              </p>
              <div className="space-y-4">
                {[
                  "Vote from anywhere — no commute required",
                  "Instant results — no waiting for manual counts",
                  "Accessible to voters with disabilities",
                  "Environmentally friendly — no paper ballots",
                  "Complete audit trail for every vote cast",
                  "Eliminates ballot spoilage and human counting error",
                ].map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold text-lg">Get Started in Minutes</h3>
                  </div>
                  <p className="text-white/60 mb-8 text-sm leading-relaxed">
                    Register with your Voter ID, verify via OTP, and cast your vote securely. The entire process takes less than 5 minutes.
                  </p>
                  <div className="space-y-3">
                    <Link href="/register">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white" data-testid="button-register-cta">
                        Create Your Voter Account <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/awareness">
                      <Button variant="outline" className="w-full border-white/20 text-white bg-transparent hover:bg-white/10" data-testid="button-learn-more">
                        Learn More About Digital Voting
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar border-t border-sidebar-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-bold text-white">SecureVote</span>
          </div>
          <p className="text-sidebar-foreground/40 text-sm">Educational prototype — not a real government election platform.</p>
          <p className="text-sidebar-foreground/30 text-xs mt-1">Demo credentials: Voter ID: V001, Password: Voter@1234 | Admin: admin / admin123</p>
        </div>
      </footer>
    </div>
  );
}
