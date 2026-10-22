import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TaskTable } from "@/components/task-table";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { EditTaskModal } from "@/components/modals/edit-task-modal";
import { ProgressModal } from "@/components/modals/progress-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Task } from "@shared/schema";

export default function TasksPage() {
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
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
              <p className="text-gray-600">Manage your learning tasks and track progress</p>
            </div>
            <Button onClick={() => setShowCreateTaskModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <TaskTable onLogProgress={handleLogProgress} onEditTask={handleEditTask} />
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