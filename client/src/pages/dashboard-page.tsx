import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatsCards } from "@/components/stats-cards";
import { WeeklyChart } from "@/components/charts/weekly-chart";
import { TaskChart } from "@/components/charts/task-chart";
import { TaskTable } from "@/components/task-table";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { EditTaskModal } from "@/components/modals/edit-task-modal";
import { ProgressModal } from "@/components/modals/progress-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Clock, Target } from "lucide-react";
import { Task } from "@shared/schema";

export default function DashboardPage() {
  const { user } = useAuth();
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleLogProgress = (taskId: number) => {
    setSelectedTaskId(taskId);
    setShowProgressModal(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowEditTaskModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onCreateTask={() => setShowCreateTaskModal(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <StatsCards />
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklyChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Task Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TaskChart />
              </CardContent>
            </Card>
          </div>

          {/* Recent Tasks */}
          <TaskTable onLogProgress={handleLogProgress} onEditTask={handleEditTask} />
          
          {/* AI Tips Section */}
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">AI Study Tips</h3>
                  <p className="text-sm text-gray-600">Personalized suggestions based on your progress</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-900">Time Management</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Consider breaking your longer study sessions into 25-minute focused blocks with 5-minute breaks.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Target className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-900">Goal Setting</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    You're making great progress! Try setting smaller daily goals to maintain momentum.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
      />
      
      <EditTaskModal
        isOpen={showEditTaskModal}
        onClose={() => setShowEditTaskModal(false)}
        task={selectedTask}
      />
      
      <ProgressModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        taskId={selectedTaskId}
      />
    </div>
  );
}
