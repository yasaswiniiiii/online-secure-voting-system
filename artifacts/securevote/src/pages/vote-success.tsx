import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, BarChart3, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function VoteSuccessPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        >
          <Card className="border-green-200 dark:border-green-800 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-10 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/50 rounded-full mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              </motion.div>

              <motion.h1
                className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Vote Successfully Cast
              </motion.h1>

              <motion.p
                className="text-green-700 dark:text-green-300 text-sm leading-relaxed"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Thank you for participating in the democratic process. Your vote has been securely recorded and counted.
              </motion.p>
            </div>

            <CardContent className="p-6 space-y-4">
              <motion.div
                className="grid grid-cols-3 gap-3 text-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  { label: "Encrypted", icon: "🔒" },
                  { label: "Recorded", icon: "📋" },
                  { label: "Anonymous", icon: "🛡️" },
                ].map((item) => (
                  <div key={item.label} className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                className="bg-muted/40 rounded-lg p-4 text-sm text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Your vote has been permanently and anonymously recorded. You will not be able to vote again in this election. Results will be available once the election period ends.
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Link href="/results">
                  <Button className="w-full" data-testid="button-view-results-success">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Results
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full" data-testid="button-go-dashboard">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
