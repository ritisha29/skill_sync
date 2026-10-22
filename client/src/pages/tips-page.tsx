import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Clock, Target, TrendingUp, BookOpen, Zap } from "lucide-react";

export default function TipsPage() {
  const { user } = useAuth();
  
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: tasks } = useQuery({
    queryKey: ["/api/tasks"],
  });

  // AI Tips based on user's actual data
  const generateTips = () => {
    const tips = [];
    
    if (stats?.totalTasks > 0 && stats?.completedTasks === 0) {
      tips.push({
        icon: Target,
        title: "Start Small",
        description: "You have tasks created but none completed yet. Try breaking down your first task into smaller 25-minute sessions.",
        category: "Goal Setting",
        color: "bg-blue-100 text-blue-600"
      });
    }
    
    if (stats?.totalHours > 0 && stats?.totalHours < 5) {
      tips.push({
        icon: Clock,
        title: "Build Consistency",
        description: "You're off to a good start! Try to maintain a regular study schedule of at least 30 minutes daily.",
        category: "Time Management",
        color: "bg-green-100 text-green-600"
      });
    }
    
    if (stats?.totalHours > 10) {
      tips.push({
        icon: TrendingUp,
        title: "Great Progress!",
        description: "You've logged significant study time. Consider reviewing your completed tasks to reinforce learning.",
        category: "Progress",
        color: "bg-purple-100 text-purple-600"
      });
    }
    
    if (stats?.overdueTasks > 0) {
      tips.push({
        icon: Zap,
        title: "Tackle Overdue Tasks",
        description: "You have overdue tasks. Consider adjusting deadlines or breaking them into smaller chunks.",
        category: "Priority Management",
        color: "bg-red-100 text-red-600"
      });
    }
    
    // Default tips when no specific patterns are found
    if (tips.length === 0) {
      tips.push(
        {
          icon: Lightbulb,
          title: "Pomodoro Technique",
          description: "Try the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break.",
          category: "Study Method",
          color: "bg-yellow-100 text-yellow-600"
        },
        {
          icon: BookOpen,
          title: "Active Learning",
          description: "Instead of just reading, try to explain concepts out loud or teach them to someone else.",
          category: "Learning Strategy",
          color: "bg-indigo-100 text-indigo-600"
        },
        {
          icon: Target,
          title: "Set SMART Goals",
          description: "Make your learning goals Specific, Measurable, Achievable, Relevant, and Time-bound.",
          category: "Goal Setting",
          color: "bg-green-100 text-green-600"
        }
      );
    }
    
    return tips;
  };

  const tips = generateTips();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Study Tips</h1>
              <p className="text-gray-600">Personalized recommendations based on your learning patterns</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-600">
              Updated based on your progress
            </Badge>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {/* Your Progress Summary */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Learning Summary</h3>
                  <p className="text-sm text-gray-600">Here's what we've learned about your study patterns</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Tasks</span>
                    <span className="text-2xl font-bold text-blue-600">{stats?.totalTasks || 0}</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Completed</span>
                    <span className="text-2xl font-bold text-green-600">{stats?.completedTasks || 0}</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Hours Logged</span>
                    <span className="text-2xl font-bold text-purple-600">{stats?.totalHours || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI-Generated Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full ${tip.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {tip.title}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {tip.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{tip.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Study Techniques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Proven Study Techniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Spaced Repetition</h4>
                  <p className="text-sm text-gray-600">
                    Review material at increasing intervals to improve long-term retention.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Active Recall</h4>
                  <p className="text-sm text-gray-600">
                    Test yourself on the material instead of just re-reading notes.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Interleaving</h4>
                  <p className="text-sm text-gray-600">
                    Mix different types of problems or topics in a single study session.
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Elaborative Interrogation</h4>
                  <p className="text-sm text-gray-600">
                    Ask yourself "why" and "how" questions to deepen understanding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}