import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";

interface HeaderProps {
  onCreateTask: () => void;
}

export function Header({ onCreateTask }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Track your learning progress.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={onCreateTask} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
          <div className="relative">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              <Bell className="h-5 w-5" />
            </Button>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
