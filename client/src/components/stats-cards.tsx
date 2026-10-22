import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ListTodo, CheckCircle, Clock, Trophy } from "lucide-react";

export function StatsCards() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const cards = [
    {
      title: "Total Tasks",
      value: stats?.totalTasks || 0,
      icon: ListTodo,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Completed",
      value: stats?.completedTasks || 0,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Hours This Week",
      value: stats?.totalHours || 0,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Streak",
      value: "7 days",
      icon: Trophy,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
