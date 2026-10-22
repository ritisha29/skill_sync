import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  LayoutDashboard, 
  ListTodo, 
  TrendingUp, 
  Lightbulb, 
  Users, 
  LogOut 
} from "lucide-react";

export function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const navItems = [
    {
      href: "/",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: "/tasks",
      icon: ListTodo,
      label: "My Tasks",
    },
    {
      href: "/progress",
      icon: TrendingUp,
      label: "Progress",
    },
    {
      href: "/tips",
      icon: Lightbulb,
      label: "AI Tips",
    },
    ...(user?.role === "admin" ? [{
      href: "/admin",
      icon: Users,
      label: "Admin Panel",
    }] : []),
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-900">SkillSync</h1>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <span
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer",
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {user?.fullName?.charAt(0) || "U"}
            </span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="text-gray-400 hover:text-gray-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
