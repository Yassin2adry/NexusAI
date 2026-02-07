import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  Search, 
  Pin,
  MoreVertical,
  Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
  lastMessage?: string;
  isPinned?: boolean;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onCreateNew: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onPinSession?: (id: string) => void;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onCreateNew,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onPinSession,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedSessions = filteredSessions.filter(s => s.isPinned);
  const regularSessions = filteredSessions.filter(s => !s.isPinned);

  const handleStartEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleFinishEdit = (id: string) => {
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const SessionItem = ({ session }: { session: ChatSession }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={() => onSelectSession(session.id)}
      className={cn(
        "group relative p-3 rounded-xl cursor-pointer transition-all duration-200",
        "hover:bg-primary/10 hover:border-primary/20",
        currentSessionId === session.id 
          ? "bg-primary/15 border border-primary-glow/30 shadow-sm shadow-primary/10" 
          : "border border-transparent"
      )}
    >
      {/* Selection indicator */}
      {currentSessionId === session.id && (
        <motion.div
          layoutId="activeSession"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-glow rounded-r-full"
        />
      )}

      {editingId === session.id ? (
        <div onClick={(e) => e.stopPropagation()}>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={() => handleFinishEdit(session.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleFinishEdit(session.id);
              if (e.key === "Escape") setEditingId(null);
            }}
            autoFocus
            className="h-7 text-sm bg-background/50"
          />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm font-medium truncate">{session.title}</span>
              {session.isPinned && (
                <Pin className="h-3 w-3 text-primary-glow flex-shrink-0" />
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-panel-solid w-40">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleStartEdit(session.id, session.title);
                }}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                {onPinSession && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onPinSession(session.id);
                  }}>
                    <Pin className="h-4 w-4 mr-2" />
                    {session.isPinned ? "Unpin" : "Pin"}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {session.lastMessage && (
            <p className="text-xs text-muted-foreground truncate pl-6">
              {session.lastMessage}
            </p>
          )}
          
          <p className="text-xs text-muted-foreground mt-1 pl-6">
            {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
          </p>
        </>
      )}
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col glass-panel border-r border-border/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50 space-y-3">
        <Button 
          onClick={onCreateNew} 
          className="w-full gap-2 hover-glow" 
          size="sm"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm bg-background/50"
          />
        </div>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {/* Pinned section */}
        {pinnedSessions.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground px-3 mb-2 font-medium uppercase tracking-wider">
              Pinned
            </p>
            <AnimatePresence>
              {pinnedSessions.map((session) => (
                <SessionItem key={session.id} session={session} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Regular sessions */}
        {regularSessions.length > 0 && (
          <div>
            {pinnedSessions.length > 0 && (
              <p className="text-xs text-muted-foreground px-3 mb-2 font-medium uppercase tracking-wider">
                Recent
              </p>
            )}
            <AnimatePresence>
              {regularSessions.map((session) => (
                <SessionItem key={session.id} session={session} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredSessions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No chats found" : "No chats yet"}
            </p>
            {!searchQuery && (
              <p className="text-xs text-muted-foreground mt-1">
                Create one to start!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
