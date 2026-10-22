import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProgressLogSchema } from "@shared/schema";
import { Loader2, Mic, Square, Play } from "lucide-react";

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number | null;
}

export function ProgressModal({ isOpen, onClose, taskId }: ProgressModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    timeSpent: "",
    completionPercentage: 50,
    notes: "",
  });
  const [isRecording, setIsRecording] = useState(false);

  const logProgressMutation = useMutation({
    mutationFn: async (progressData: any) => {
      const validatedData = insertProgressLogSchema.parse({
        ...progressData,
        taskId: taskId!,
        timeSpent: parseInt(progressData.timeSpent),
        completionPercentage: progressData.completionPercentage,
      });
      
      const response = await apiRequest("POST", "/api/progress-logs", validatedData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress-logs"] });
      toast({
        title: "Progress logged",
        description: "Your progress has been successfully recorded.",
      });
      onClose();
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error logging progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      timeSpent: "",
      completionPercentage: 50,
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId) return;
    logProgressMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement audio recording functionality
    toast({
      title: "Audio recording",
      description: "Audio recording functionality will be implemented in a future version.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Progress</DialogTitle>
          <DialogDescription>
            Record your learning progress including time spent and completion percentage.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="timeSpent">Time Spent (minutes)</Label>
            <Input
              id="timeSpent"
              type="number"
              value={formData.timeSpent}
              onChange={(e) => handleInputChange("timeSpent", e.target.value)}
              placeholder="0"
              min="0"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="completion">Completion Percentage</Label>
            <div className="space-y-2">
              <Slider
                value={[formData.completionPercentage]}
                onValueChange={(value) => handleInputChange("completionPercentage", value[0])}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span className="font-medium">{formData.completionPercentage}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="What did you learn or accomplish?"
              rows={4}
            />
          </div>
          
          <div>
            <Label>Audio Note</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Button
                type="button"
                variant={isRecording ? "destructive" : "secondary"}
                size="sm"
                onClick={handleRecording}
              >
                {isRecording ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Record
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Play
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={logProgressMutation.isPending} className="flex-1">
              {logProgressMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Progress
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
