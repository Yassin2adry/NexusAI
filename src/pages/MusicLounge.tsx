import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Heart, Plus, ListMusic, Radio, Search, Shuffle, Repeat, Youtube } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Track {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  addedBy: string;
}

export default function MusicLounge() {
  const [queue, setQueue] = useState<Track[]>([
    { id: "1", title: "Lofi Beats to Code To", artist: "ChillHop", youtubeId: "jfKfPfyJRdk", addedBy: "System" },
    { id: "2", title: "Synthwave Radio", artist: "Retrowave FM", youtubeId: "4xDzrJKXOOY", addedBy: "System" },
    { id: "3", title: "Gaming Music Mix", artist: "NCS", youtubeId: "36YnV9STBqc", addedBy: "System" },
  ]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(queue[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchUrl, setSearchUrl] = useState("");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(80);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addFromUrl = () => {
    const match = searchUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (match) {
      const newTrack: Track = {
        id: Date.now().toString(),
        title: "Custom Track",
        artist: "YouTube",
        youtubeId: match[1],
        addedBy: "You",
      };
      setQueue(prev => [...prev, newTrack]);
      setSearchUrl("");
      toast.success("Added to queue!");
    } else {
      toast.error("Invalid YouTube URL");
    }
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    const next = isShuffle
      ? queue[Math.floor(Math.random() * queue.length)]
      : queue[(idx + 1) % queue.length];
    playTrack(next);
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    playTrack(queue[(idx - 1 + queue.length) % queue.length]);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Music className="h-4 w-4 text-primary-glow" />
              <span className="text-xs font-medium text-primary-glow">Listen Together</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Music Lounge</h1>
            <p className="text-muted-foreground">Listen to music while you build</p>
          </div>

          {/* Player */}
          <Card className="p-6 glass-panel mb-6">
            {currentTrack && (
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-40 h-40 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={`https://img.youtube.com/vi/${currentTrack.youtubeId}/0.jpg`}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold">{currentTrack.title}</h3>
                  <p className="text-muted-foreground">{currentTrack.artist}</p>

                  {/* Controls */}
                  <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                    <Button variant="ghost" size="icon" onClick={() => setIsShuffle(!isShuffle)} className={isShuffle ? 'text-primary-glow' : ''}>
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={prevTrack}>
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button size="icon" className="h-14 w-14 rounded-full" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextTrack}>
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsRepeat(!isRepeat)} className={isRepeat ? 'text-primary-glow' : ''}>
                      <Repeat className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(+e.target.value)} className="w-32 accent-primary" />
                    <span className="text-xs text-muted-foreground w-8">{volume}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Hidden YouTube iframe for audio */}
            {currentTrack && isPlaying && (
              <iframe
                src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&loop=${isRepeat ? 1 : 0}`}
                className="hidden"
                allow="autoplay"
                title="music player"
              />
            )}
          </Card>

          {/* Add to queue */}
          <Card className="p-4 glass-panel mb-6">
            <div className="flex gap-2">
              <Youtube className="h-5 w-5 text-red-500 mt-2" />
              <Input
                value={searchUrl}
                onChange={e => setSearchUrl(e.target.value)}
                placeholder="Paste YouTube URL to add to queue..."
                className="flex-1"
              />
              <Button onClick={addFromUrl} size="sm" className="gap-1">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </Card>

          {/* Queue */}
          <Card className="glass-panel">
            <div className="p-4 border-b border-border/40 flex items-center gap-2">
              <ListMusic className="h-5 w-5 text-primary-glow" />
              <h3 className="font-semibold">Queue</h3>
              <span className="text-xs text-muted-foreground">({queue.length} tracks)</span>
            </div>
            <ScrollArea className="max-h-96">
              <div className="p-2">
                {queue.map((track, i) => (
                  <motion.button
                    key={track.id}
                    whileHover={{ x: 2 }}
                    onClick={() => playTrack(track)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                      currentTrack?.id === track.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-xs text-muted-foreground w-6">{i + 1}</span>
                    <img
                      src={`https://img.youtube.com/vi/${track.youtubeId}/default.jpg`}
                      alt=""
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground">{track.artist}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}>
                      <Heart className={`h-4 w-4 transition-colors ${liked.has(track.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                    </button>
                    {currentTrack?.id === track.id && isPlaying && (
                      <div className="flex items-end gap-0.5 h-4">
                        {[0, 1, 2].map(j => (
                          <motion.div
                            key={j}
                            animate={{ height: [4, 16, 4] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.15 }}
                            className="w-1 bg-primary-glow rounded-full"
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
