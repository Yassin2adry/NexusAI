import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Task {
  id: string;
  type: string;
  status: string;
  credits_cost: number;
  credits_deducted: boolean;
  created_at: string;
  completed_at: string | null;
  error_message: string | null;
}

export function TaskHistory({ limit = 10 }: { limit?: number }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadTasks = async () => {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();

    // Subscribe to task changes
    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, limit]);

  const getTaskIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-primary-glow animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatTaskType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <Card className="p-6 glass-panel">
        <p className="text-sm text-muted-foreground">Loading tasks...</p>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="p-6 glass-panel">
        <p className="text-sm text-muted-foreground">No tasks yet. Start chatting to see your activity!</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 glass-panel space-y-4">
      <h3 className="font-semibold text-lg">Recent Activity</h3>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3 rounded-lg glass-panel hover-glow transition-all flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {getTaskIcon(task.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {formatTaskType(task.type)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                </p>
                {task.error_message && (
                  <p className="text-xs text-destructive mt-1">{task.error_message}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className={`text-sm font-medium ${
                task.credits_deducted ? "text-primary-glow" : "text-muted-foreground"
              }`}>
                {task.credits_deducted ? "-" : ""}{task.credits_cost}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
