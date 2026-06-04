import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import NotFound from "@/pages/not-found";

import HomePage from "@/pages/home";
import RegisterPage from "@/pages/register";
import LoginPage from "@/pages/login";
import VerifyOtpPage from "@/pages/verify-otp";
import DashboardPage from "@/pages/dashboard";
import CandidatesPage from "@/pages/candidates";
import VoteConfirmPage from "@/pages/vote-confirm";
import VoteSuccessPage from "@/pages/vote-success";
import ResultsPage from "@/pages/results";
import AwarenessPage from "@/pages/awareness";
import ProfilePage from "@/pages/profile";

import AdminLoginPage from "@/pages/admin/login";
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminElectionsPage from "@/pages/admin/elections";
import AdminCandidatesPage from "@/pages/admin/candidates";
import AdminVotersPage from "@/pages/admin/voters";
import AdminResultsPage from "@/pages/admin/results";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30_000,
      retry: 1,
    },
  },
});

const NO_NAVBAR_PATHS = ["/admin/login"];

function isAdminLoginPath(path: string) {
  return NO_NAVBAR_PATHS.some((p) => path === p || path.endsWith(p));
}

function Router({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const [location] = useLocation();
  const showNavbar = !isAdminLoginPath(location);

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/verify-otp" component={VerifyOtpPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/candidates" component={CandidatesPage} />
          <Route path="/vote/confirm" component={VoteConfirmPage} />
          <Route path="/vote/success" component={VoteSuccessPage} />
          <Route path="/results" component={ResultsPage} />
          <Route path="/awareness" component={AwarenessPage} />
          <Route path="/profile" component={ProfilePage} />

          <Route path="/admin/login" component={AdminLoginPage} />
          <Route path="/admin/dashboard" component={AdminDashboardPage} />
          <Route path="/admin/elections" component={AdminElectionsPage} />
          <Route path="/admin/candidates" component={AdminCandidatesPage} />
          <Route path="/admin/voters" component={AdminVotersPage} />
          <Route path="/admin/results" component={AdminResultsPage} />

          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function NavbarAwareRouter({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  return <Router theme={theme} toggleTheme={toggleTheme} />;
}

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("sv_theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("sv_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <NavbarAwareRouter theme={theme} toggleTheme={toggleTheme} />
        </WouterRouter>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
