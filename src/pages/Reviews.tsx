import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star, Search, ThumbsUp, ThumbsDown, Shield, Flag, MessageSquare,
  Filter, ChevronDown, CheckCircle2, Gamepad2, Clock, BarChart3,
  Award, Sparkles, Send, X, Plus, User, AlertTriangle, Eye
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const StarRating = ({ rating, onRate, size = "md", interactive = false }: {
  rating: number;
  onRate?: (r: number) => void;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}) => {
  const [hover, setHover] = useState(0);
  const sizeMap = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7" };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          disabled={!interactive}
          onClick={() => onRate?.(i)}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
        >
          <Star
            className={`${sizeMap[size]} ${
              i <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

// ── Write Review Modal ──
const WriteReview = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (review: any) => void }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pros, setPros] = useState<string[]>([""]);
  const [cons, setCons] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [robloxVerified, setRobloxVerified] = useState(false);
  const [robloxProfile, setRobloxProfile] = useState<any>(null);

  const tagOptions = ["fun", "creative", "buggy", "great-ui", "laggy", "polished", "educational", "addictive"];

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles")
      .select("roblox_username, roblox_avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.roblox_username) {
          setRobloxVerified(true);
          setRobloxProfile(data);
        }
      });
  }, [user]);

  const handleSubmit = async () => {
    if (!rating || !title.trim() || !body.trim()) {
      toast.error("Please fill in rating, title, and review body");
      return;
    }
    if (!robloxVerified) {
      toast.error("You must verify your Roblox account to leave reviews");
      return;
    }
    setSubmitting(true);
    onSubmit({
      rating,
      title,
      body,
      pros: pros.filter(p => p.trim()),
      cons: cons.filter(c => c.trim()),
      tags,
      roblox_verified: true,
      roblox_username: robloxProfile?.roblox_username,
      roblox_avatar_url: robloxProfile?.roblox_avatar_url,
    });
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Write a Review</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>

        {!robloxVerified && (
          <Card className="p-4 mb-4 border-warning/30 bg-warning/5">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <p className="font-medium text-sm">Roblox Verification Required</p>
                <p className="text-xs text-muted-foreground">Link and verify your Roblox account to post reviews.</p>
              </div>
            </div>
            <Button size="sm" className="mt-2" onClick={() => window.location.href = "/roblox-link"}>
              Verify Now
            </Button>
          </Card>
        )}

        {robloxVerified && robloxProfile && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
            <img src={robloxProfile.roblox_avatar_url} alt="" className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm font-medium text-foreground flex items-center gap-1">
                {robloxProfile.roblox_username}
                <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-400 ml-1">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Verified
                </Badge>
              </p>
              <p className="text-xs text-muted-foreground">Reviewing as verified Roblox player</p>
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
          <StarRating rating={rating} onRate={setRating} size="lg" interactive />
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Summarize your experience" />
        </div>

        {/* Body */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">Review</label>
          <Textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Share your detailed experience..." rows={4} />
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-green-400 mb-2 block">👍 Pros</label>
            {pros.map((p, i) => (
              <Input
                key={i}
                value={p}
                onChange={e => { const n = [...pros]; n[i] = e.target.value; setPros(n); }}
                placeholder={`Pro ${i + 1}`}
                className="mb-1 text-sm"
              />
            ))}
            {pros.length < 5 && (
              <Button variant="ghost" size="sm" onClick={() => setPros([...pros, ""])} className="text-xs">
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-red-400 mb-2 block">👎 Cons</label>
            {cons.map((c, i) => (
              <Input
                key={i}
                value={c}
                onChange={e => { const n = [...cons]; n[i] = e.target.value; setCons(n); }}
                placeholder={`Con ${i + 1}`}
                className="mb-1 text-sm"
              />
            ))}
            {cons.length < 5 && (
              <Button variant="ghost" size="sm" onClick={() => setCons([...cons, ""])} className="text-xs">
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map(tag => (
              <button
                key={tag}
                onClick={() => setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  tags.includes(tag)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={submitting || !robloxVerified} className="w-full gap-2">
          <Send className="w-4 h-4" /> Submit Review
        </Button>
      </motion.div>
    </motion.div>
  );
};

// ── Review Card ──
const ReviewCard = ({ review }: { review: any }) => {
  const { user } = useAuth();
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);
  const [voted, setVoted] = useState(false);

  const handleVote = async (type: "helpful" | "unhelpful") => {
    if (!user) { toast.error("Sign in to vote"); return; }
    if (voted) return;
    
    await supabase.from("review_votes").insert({
      review_id: review.id,
      user_id: user.id,
      vote_type: type,
    });
    
    if (type === "helpful") setHelpfulCount(h => h + 1);
    setVoted(true);
    toast.success("Vote recorded");
  };

  const handleReport = async () => {
    if (!user) return;
    await supabase.from("reviews").update({ reported: true }).eq("id", review.id);
    toast.success("Review reported for moderation");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-5 mb-4">
        <div className="flex items-start gap-4">
          <img
            src={review.roblox_avatar_url || "/placeholder.svg"}
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground text-sm">
                {review.roblox_username || "Anonymous"}
              </span>
              {review.roblox_verified && (
                <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-400">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Verified Player
                </Badge>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>

            <StarRating rating={review.rating} size="sm" />

            <h4 className="font-semibold text-foreground mt-2">{review.title}</h4>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.body}</p>

            {(review.pros?.length > 0 || review.cons?.length > 0) && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                {review.pros?.length > 0 && (
                  <div>
                    {review.pros.map((p: string, i: number) => (
                      <p key={i} className="text-xs text-green-400 flex items-center gap-1">
                        <span>+</span> {p}
                      </p>
                    ))}
                  </div>
                )}
                {review.cons?.length > 0 && (
                  <div>
                    {review.cons.map((c: string, i: number) => (
                      <p key={i} className="text-xs text-red-400 flex items-center gap-1">
                        <span>−</span> {c}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {review.tags?.length > 0 && (
              <div className="flex gap-1 mt-3 flex-wrap">
                {review.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
              <button
                onClick={() => handleVote("helpful")}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  voted ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({helpfulCount})
              </button>
              <button
                onClick={handleReport}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto"
              >
                <Flag className="w-3.5 h-3.5" /> Report
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// ── Main Reviews Page ──
const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [showWrite, setShowWrite] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest" | "helpful">("newest");
  const [filterVerified, setFilterVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Stats
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: reviews.filter(rv => rv.rating === r).length,
    percent: reviews.length > 0 ? (reviews.filter(rv => rv.rating === r).length / reviews.length) * 100 : 0,
  }));
  const verifiedCount = reviews.filter(r => r.roblox_verified).length;

  useEffect(() => {
    loadReviews();
  }, [sortBy, filterVerified]);

  const loadReviews = async () => {
    let query = supabase.from("reviews").select("*");
    if (filterVerified) query = query.eq("roblox_verified", true);
    
    switch (sortBy) {
      case "newest": query = query.order("created_at", { ascending: false }); break;
      case "highest": query = query.order("rating", { ascending: false }); break;
      case "lowest": query = query.order("rating", { ascending: true }); break;
      case "helpful": query = query.order("helpful_count", { ascending: false }); break;
    }
    
    const { data } = await query.limit(50);
    setReviews(data || []);
    setLoading(false);
  };

  const handleSubmitReview = async (reviewData: any) => {
    if (!user) return;
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      item_id: "00000000-0000-0000-0000-000000000000", // general platform review
      item_type: "marketplace",
      ...reviewData,
    });
    
    if (error) {
      if (error.code === "23505") toast.error("You already reviewed this item");
      else toast.error("Failed to submit review");
    } else {
      toast.success("Review submitted! 🎉");
      setShowWrite(false);
      loadReviews();
    }
  };

  const filteredReviews = reviews.filter(r =>
    !searchQuery || r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.roblox_username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-3">
                <Shield className="w-4 h-4" /> Verified Reviews
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Community Reviews</h1>
              <p className="text-muted-foreground">Real reviews from verified Roblox players</p>
            </div>
            <Button onClick={() => user ? setShowWrite(true) : toast.error("Sign in to write a review")} className="gap-2">
              <Plus className="w-4 h-4" /> Write Review
            </Button>
          </div>

          <div className="grid lg:grid-cols-[300px,1fr] gap-8">
            {/* Stats Sidebar */}
            <div className="space-y-4">
              <Card className="p-6">
                <div className="text-center mb-4">
                  <p className="text-5xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
                  <StarRating rating={Math.round(avgRating)} size="md" />
                  <p className="text-sm text-muted-foreground mt-1">{reviews.length} reviews</p>
                </div>
                <div className="space-y-2">
                  {ratingDist.map(r => (
                    <div key={r.stars} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-3">{r.stars}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${r.percent}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-6 text-right">{r.count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-foreground">Trust Score</span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {reviews.length > 0 ? Math.round((verifiedCount / reviews.length) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">verified reviewers</p>
              </Card>
            </div>

            {/* Reviews List */}
            <div>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {(["newest", "highest", "lowest", "helpful"] as const).map(s => (
                    <Button
                      key={s}
                      variant={sortBy === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy(s)}
                    >
                      {s}
                    </Button>
                  ))}
                  <Button
                    variant={filterVerified ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterVerified(!filterVerified)}
                    className="gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Verified Only
                  </Button>
                </div>
              </div>

              {filteredReviews.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Star className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No reviews yet</p>
                  <p className="text-sm">Be the first to share your experience!</p>
                </div>
              ) : (
                filteredReviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {showWrite && <WriteReview onClose={() => setShowWrite(false)} onSubmit={handleSubmitReview} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Reviews;
