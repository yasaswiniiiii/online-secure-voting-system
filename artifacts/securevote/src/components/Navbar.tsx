import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShieldCheck, LogOut, User, BarChart3, Users, Vote, Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  theme: string;
  toggleTheme: () => void;
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/");
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-sidebar text-sidebar-foreground border-b border-sidebar-border shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">SecureVote</span>
              <span className="hidden sm:block text-xs text-sidebar-foreground/60 leading-none">Secure Online Voting</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/awareness">
              <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent">
                Awareness
              </Button>
            </Link>
            <Link href="/results">
              <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent">
                Results
              </Button>
            </Link>
            {isAuthenticated && !isAdmin && (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/candidates">
                  <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent">
                    Candidates
                  </Button>
                </Link>
              </>
            )}
            {isAdmin && (
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent">
                  Admin Panel
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent w-8 h-8"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {user?.fullName?.charAt(0) ?? "U"}
                    </div>
                    <span className="hidden sm:block max-w-24 truncate">{user?.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {!isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => setLocation("/profile")}>
                        <User className="w-4 h-4 mr-2" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocation("/dashboard")}>
                        <Vote className="w-4 h-4 mr-2" /> Dashboard
                      </DropdownMenuItem>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => setLocation("/admin/dashboard")}>
                        <BarChart3 className="w-4 h-4 mr-2" /> Admin Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocation("/admin/voters")}>
                        <Users className="w-4 h-4 mr-2" /> Voters
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent w-8 h-8"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-sidebar-border py-3 space-y-1">
            <Link href="/awareness" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent">Awareness</Button>
            </Link>
            <Link href="/results" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent">Results</Button>
            </Link>
            {isAuthenticated && !isAdmin && (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent">Dashboard</Button>
                </Link>
                <Link href="/candidates" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent">Candidates</Button>
                </Link>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full justify-start">Register</Button>
                </Link>
              </>
            )}
            {isAuthenticated && (
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
