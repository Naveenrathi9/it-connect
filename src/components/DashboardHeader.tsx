import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut } from 'lucide-react';

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { role, logout } = useAuth();
  const { theme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <img 
            src={theme === 'dark' ? "/logo.png" : "/power.png"} 
            alt="Logo" 
            className="h-10 w-auto object-contain" 
          />
          <div className="border-l border-border h-8" />
          <div>
            <h1 className="text-xl font-semibold">Asset Return Management</h1>
            <p className="text-sm text-muted-foreground">{role} Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
