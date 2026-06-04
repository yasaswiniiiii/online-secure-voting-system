import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Globe, Lock, BarChart3, ShieldCheck, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function AwarenessPage() {
  const stats = [
    { value: "67%", label: "Higher Turnout", desc: "Countries with online voting report significantly higher participation rates." },
    { value: "83%", label: "Cost Reduction", desc: "Administrative costs drop drastically compared to paper-based elections." },
    { value: "99.9%", label: "Accuracy", desc: "Digital systems eliminate manual counting errors and ballot spoilage." },
    { value: "5 min", label: "Avg. Vote Time", desc: "Average time to complete an online vote from login to confirmation." },
  ];

  const securityMeasures = [
    { icon: Lock, title: "End-to-End Encryption", desc: "All votes are encrypted using military-grade AES-256 encryption before transmission." },
    { icon: ShieldCheck, title: "Multi-Factor Authentication", desc: "Voter identity is verified through both password and one-time password (OTP)." },
    { icon: Users, title: "One Vote Per Person", desc: "Database constraints and session tracking prevent any voter from casting duplicate votes." },
    { icon: Globe, title: "Audit Trails", desc: "Every action is logged in an immutable audit log, enabling complete post-election verification." },
    { icon: Zap, title: "Real-Time Monitoring", desc: "Anomaly detection systems flag suspicious activity and prevent automated attacks." },
    { icon: BarChart3, title: "Transparent Tallying", desc: "Vote counting is automated and publicly verifiable, eliminating human counting bias." },
  ];

  const faqs = [
    { q: "Is my vote truly anonymous?", a: "Yes. Your identity is verified at login, but your vote choice is stored separately and cannot be linked back to you. Even system administrators cannot see how you voted." },
    { q: "What happens if I lose internet connection while voting?", a: "If connection drops before you confirm, your vote is not recorded. Simply log in again — your session is preserved for a limited time and you can complete voting." },
    { q: "Can I change my vote after submitting?", a: "No. Once confirmed, a vote is final and immutable. This mirrors the permanence of traditional paper ballots and ensures election integrity." },
    { q: "How do I know the results are accurate?", a: "All vote tallies are computed automatically from the encrypted vote records. An independent audit log is maintained that can be used to verify the count." },
    { q: "What if my Voter ID is stolen?", a: "Contact the election authority immediately. The OTP requirement means a stolen password alone is insufficient — an attacker would also need access to your registered device." },
    { q: "Is the system accessible on mobile devices?", a: "Yes. SecureVote is built with a fully responsive design and works on any device including smartphones, tablets, and desktop computers." },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20">
          Community Awareness
        </Badge>
        <h1 className="text-4xl font-bold text-foreground mb-4">Awareness About Secure Online Voting</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Understanding digital democracy — why online voting matters and how it stays secure.
        </p>
      </div>

      {/* Importance of Voting */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
        <Card className="border-border overflow-hidden">
          <div className="bg-sidebar p-6">
            <h2 className="text-xl font-bold text-white">The Importance of Voting</h2>
            <p className="text-sidebar-foreground/70 text-sm mt-1">Your voice shapes the future</p>
          </div>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Voting is the cornerstone of democracy. Every eligible citizen who abstains from voting allows others to make decisions on their behalf. In collective institutions — schools, colleges, communities — student and community council elections shape policies that directly affect daily life.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Research consistently shows that higher voter turnout leads to more representative outcomes and better governance. When you vote, you are not just choosing a candidate — you are affirming the value of democratic participation itself.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "Determines who makes decisions affecting your life",
                  "Ensures minority voices are heard and counted",
                  "Creates accountability in leadership",
                  "Strengthens the legitimacy of elected bodies",
                  "Sets precedent for civic participation culture",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Benefits of Digital Voting */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Benefits of Digital Voting</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Globe, title: "No Geographic Barriers", desc: "Vote from anywhere with an internet connection — ideal for students away from home." },
            { icon: Zap, title: "Instant Results", desc: "Eliminate days of counting. Results are available within seconds of the election closing." },
            { icon: Users, title: "Higher Participation", desc: "Removing physical requirements dramatically increases voter turnout across all demographics." },
            { icon: BarChart3, title: "Transparent Process", desc: "Every step is logged and verifiable. Contested results can be independently audited." },
            { icon: Lock, title: "Eliminates Fraud", desc: "Cryptographic systems make ballot tampering and stuffing technically impossible." },
            { icon: CheckCircle2, title: "Accessible to All", desc: "Voters with mobility, visual, or other disabilities can participate equally from any device." },
          ].map((b, i) => (
            <motion.div key={b.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
              <Card className="h-full border-border">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Security Measures */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-2">Security Measures</h2>
        <p className="text-muted-foreground mb-6">How SecureVote protects the integrity of every election</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {securityMeasures.map((s, i) => (
            <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
              <Card className="border-border">
                <CardContent className="p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-12">
        <div className="bg-sidebar rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Survey Statistics on Digital Voting</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={s.label} className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <p className="text-3xl font-bold text-primary mb-1">{s.value}</p>
                <p className="text-sm font-semibold text-white/80 mb-1">{s.label}</p>
                <p className="text-xs text-sidebar-foreground/50 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
        <Card className="border-border">
          <CardContent className="p-2">
            <Accordion type="single" collapsible>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left px-4 font-medium text-foreground hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
