import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen, Search, Play, Clock, CheckCircle2, ArrowRight,
  Code, Layout, Zap, Bot, Gamepad2, Globe, Star, Users,
  FileText, Video, Award, Bookmark, Filter, ChevronRight,
  GraduationCap, Sparkles, Trophy, BarChart3, Heart
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const categoryIcons: Record<string, any> = {
  scripting: Code,
  design: Layout,
  ai: Bot,
  gamedev: Gamepad2,
};

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

const Learn = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [lessonProgress, setLessonProgress] = useState<any[]>([]);
  const [activeCourse, setActiveCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
    if (user) loadEnrollments();
  }, [user]);

  useEffect(() => {
    if (activeCourse) loadLessons(activeCourse.id);
  }, [activeCourse]);

  const loadCourses = async () => {
    const { data } = await supabase.from("learn_courses").select("*").order("created_at");
    setCourses(data || []);
    setLoading(false);
  };

  const loadLessons = async (courseId: string) => {
    const { data } = await supabase
      .from("learn_lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("position");
    setLessons(data || []);
    if (user) loadLessonProgress(courseId);
  };

  const loadEnrollments = async () => {
    const { data } = await supabase.from("learn_enrollments").select("*");
    setEnrollments(data || []);
  };

  const loadLessonProgress = async (courseId: string) => {
    const lessonIds = lessons.map(l => l.id);
    if (lessonIds.length === 0) return;
    const { data } = await supabase
      .from("learn_lesson_progress")
      .select("*")
      .in("lesson_id", lessonIds);
    setLessonProgress(data || []);
  };

  const enroll = async (courseId: string) => {
    if (!user) { toast.error("Sign in to enroll"); return; }
    await supabase.from("learn_enrollments").upsert({
      user_id: user.id,
      course_id: courseId,
    }, { onConflict: "user_id,course_id" });
    toast.success("Enrolled! Start learning.");
    loadEnrollments();
  };

  const markComplete = async (lessonId: string) => {
    if (!user) return;
    await supabase.from("learn_lesson_progress").upsert({
      user_id: user.id,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" });
    toast.success("Lesson completed! 🎉");
    if (activeCourse) loadLessons(activeCourse.id);
  };

  const isEnrolled = (courseId: string) => enrollments.some(e => e.course_id === courseId);
  const getEnrollment = (courseId: string) => enrollments.find(e => e.course_id === courseId);
  const isLessonComplete = (lessonId: string) => lessonProgress.some(p => p.lesson_id === lessonId && p.completed);

  const filteredCourses = courses.filter(c => {
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterDifficulty && c.difficulty !== filterDifficulty) return false;
    if (filterCategory && c.category !== filterCategory) return false;
    return true;
  });

  const categories = [...new Set(courses.map(c => c.category))];

  // ── Lesson View ──
  if (activeLesson) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
          <Button variant="ghost" onClick={() => setActiveLesson(null)} className="mb-4">
            ← Back to course
          </Button>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <Badge className={difficultyColors[activeCourse?.difficulty || "beginner"]}>
                {activeLesson.lesson_type}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {activeLesson.estimated_minutes} min
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-6">{activeLesson.title}</h1>
            
            <Card className="p-8 mb-6">
              <div className="prose prose-invert max-w-none">
                {activeLesson.content.split('\n').map((line: string, i: number) => {
                  if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-foreground mb-4">{line.slice(2)}</h1>;
                  if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold text-foreground mb-3 mt-6">{line.slice(3)}</h2>;
                  if (line.startsWith('```')) return null;
                  if (line.startsWith('- ')) return <li key={i} className="text-muted-foreground ml-4">{line.slice(2)}</li>;
                  if (line.trim()) return <p key={i} className="text-muted-foreground mb-2 leading-relaxed">{line}</p>;
                  return <br key={i} />;
                })}
              </div>
            </Card>

            {activeLesson.lesson_type === "quiz" && (
              <Card className="p-6 border-primary/20">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" /> Quiz Time
                </h3>
                <p className="text-muted-foreground mb-4">Test your knowledge from this section.</p>
                <Button onClick={() => { markComplete(activeLesson.id); toast.success("Quiz completed!"); }}>
                  Complete Quiz
                </Button>
              </Card>
            )}

            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => markComplete(activeLesson.id)}
                disabled={isLessonComplete(activeLesson.id)}
                className="gap-2"
              >
                {isLessonComplete(activeLesson.id) ? (
                  <><CheckCircle2 className="w-4 h-4 text-green-400" /> Completed</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Mark as Complete</>
                )}
              </Button>

              {lessons.findIndex(l => l.id === activeLesson.id) < lessons.length - 1 && (
                <Button
                  onClick={() => {
                    const idx = lessons.findIndex(l => l.id === activeLesson.id);
                    setActiveLesson(lessons[idx + 1]);
                  }}
                  className="gap-2"
                >
                  Next Lesson <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // ── Course View ──
  if (activeCourse) {
    const enrollment = getEnrollment(activeCourse.id);
    const completedCount = lessonProgress.filter(p => p.completed).length;
    const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
          <Button variant="ghost" onClick={() => { setActiveCourse(null); setLessons([]); setLessonProgress([]); }} className="mb-4">
            ← Back to courses
          </Button>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={difficultyColors[activeCourse.difficulty]}>{activeCourse.difficulty}</Badge>
                  <Badge variant="outline">{activeCourse.category}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{activeCourse.title}</h1>
                <p className="text-muted-foreground">{activeCourse.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {activeCourse.estimated_hours}h</span>
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {activeCourse.lesson_count} lessons</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {activeCourse.enrolled_count} enrolled</span>
                </div>
              </div>
              {!isEnrolled(activeCourse.id) ? (
                <Button onClick={() => enroll(activeCourse.id)} className="gap-2">
                  <GraduationCap className="w-4 h-4" /> Enroll Free
                </Button>
              ) : (
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Enrolled
                </Badge>
              )}
            </div>

            {isEnrolled(activeCourse.id) && (
              <Card className="p-4 mb-6 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
                <span className="text-sm text-muted-foreground">{completedCount}/{lessons.length} lessons</span>
              </Card>
            )}

            <h2 className="text-xl font-bold text-foreground mb-4">Lessons</h2>
            <div className="space-y-2">
              {lessons.map((lesson, i) => {
                const completed = isLessonComplete(lesson.id);
                const typeIcon = lesson.lesson_type === "video" ? Video :
                  lesson.lesson_type === "quiz" ? Award :
                  lesson.lesson_type === "lab" ? Code : FileText;
                const TypeIcon = typeIcon;
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <button
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full p-4 rounded-xl border flex items-center gap-4 text-left transition-all hover:border-primary/30 ${
                        completed ? "border-green-500/20 bg-green-500/5" : "border-border"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        completed ? "bg-green-500/20 text-green-400" : "bg-secondary text-muted-foreground"
                      }`}>
                        {completed ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <TypeIcon className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">{lesson.lesson_type} · {lesson.estimated_minutes} min</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // ── Course Catalog ──
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <GraduationCap className="w-4 h-4" /> Learning Hub
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">Master Roblox Development</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interactive courses, hands-on labs, and quizzes — track your progress and earn badges.
            </p>
          </div>

          {/* Stats */}
          {user && enrollments.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Enrolled", value: enrollments.length, icon: BookOpen },
                { label: "Completed", value: enrollments.filter(e => e.completed).length, icon: Trophy },
                { label: "In Progress", value: enrollments.filter(e => !e.completed).length, icon: BarChart3 },
                { label: "Courses", value: courses.length, icon: Star },
              ].map((stat, i) => (
                <Card key={i} className="p-4 text-center">
                  <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterDifficulty === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterDifficulty(null)}
              >
                All Levels
              </Button>
              {["beginner", "intermediate", "advanced"].map(d => (
                <Button
                  key={d}
                  variant={filterDifficulty === d ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterDifficulty(filterDifficulty === d ? null : d)}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={filterCategory === null ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterCategory(null)}
            >
              All
            </Button>
            {categories.map(cat => {
              const Icon = categoryIcons[cat] || Globe;
              return (
                <Button
                  key={cat}
                  variant={filterCategory === cat ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                  className="gap-1"
                >
                  <Icon className="w-3 h-3" /> {cat}
                </Button>
              );
            })}
          </div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, i) => {
              const Icon = categoryIcons[course.category] || Globe;
              const enrolled = isEnrolled(course.id);
              const enrollment = getEnrollment(course.id);

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    className="p-6 cursor-pointer group hover:border-primary/30 transition-all flex flex-col h-full"
                    onClick={() => setActiveCourse(course)}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Badge className={`text-xs ${difficultyColors[course.difficulty]}`}>
                          {course.difficulty}
                        </Badge>
                      </div>
                      {enrolled && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{course.description}</p>

                    {enrolled && enrollment && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-foreground">{enrollment.progress_percent}%</span>
                        </div>
                        <Progress value={enrollment.progress_percent} className="h-1.5" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.estimated_hours}h</span>
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {course.lesson_count} lessons</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrolled_count}</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No courses found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
