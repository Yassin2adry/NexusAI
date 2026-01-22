import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MessageSquare, Send, CheckCircle2, Loader2, MapPin, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { ParticleField, FloatingOrbs } from "@/components/animations/ParticleField";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: { name, email, subject, message },
      });

      if (error) throw error;

      setSuccess(true);
      toast.success("Message sent successfully!");
      
      // Reset form after delay
      setTimeout(() => {
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />
      
      {/* Background effects */}
      <div className="absolute inset-0 animated-gradient opacity-50" />
      <FloatingOrbs />
      <ParticleField particleCount={30} />
      
      <div className="container mx-auto px-4 pt-28 pb-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="h-4 w-4 text-primary-glow" />
                <span className="text-sm">Get in Touch</span>
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text-animated">
                Contact Us
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions, feedback, or need support? We'd love to hear from you.
              </p>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <StaggerContainer className="lg:col-span-2 space-y-6">
              <StaggerItem>
                <Card className="p-6 glass-panel hover-glow transition-all group">
                  <motion.div
                    className="p-3 rounded-xl bg-primary/10 w-fit mb-4"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring" }}
                  >
                    <Mail className="h-8 w-8 text-primary-glow" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-glow transition-colors">
                    Email Us
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    We typically respond within 24 hours.
                  </p>
                  <a
                    href="mailto:yassin.kadry@icloud.com"
                    className="text-primary-glow hover:underline font-medium"
                  >
                    yassin.kadry@icloud.com
                  </a>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="p-6 glass-panel hover-glow transition-all group">
                  <motion.div
                    className="p-3 rounded-xl bg-primary/10 w-fit mb-4"
                    whileHover={{ rotate: -10, scale: 1.1 }}
                    transition={{ type: "spring" }}
                  >
                    <Clock className="h-8 w-8 text-primary-glow" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-glow transition-colors">
                    Response Time
                  </h3>
                  <p className="text-muted-foreground">
                    Most inquiries are answered within 24 hours during business days.
                  </p>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="p-6 glass-panel hover-glow transition-all group">
                  <motion.div
                    className="p-3 rounded-xl bg-primary/10 w-fit mb-4"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring" }}
                  >
                    <MessageSquare className="h-8 w-8 text-primary-glow" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-glow transition-colors">
                    Technical Support
                  </h3>
                  <p className="text-muted-foreground">
                    For account issues or technical problems, include your Roblox username for faster assistance.
                  </p>
                </Card>
              </StaggerItem>
            </StaggerContainer>

            {/* Contact Form */}
            <FadeIn delay={0.3} className="lg:col-span-3">
              <Card className="p-8 glass-panel hover-glow transition-all relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center justify-center py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
                      >
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground text-center">
                        We've received your message and will get back to you soon.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Send a Message</h2>
                        <p className="text-muted-foreground text-sm">
                          Fill out the form below and we'll get back to you.
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                            className="input-glow bg-background/50"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            required
                            className="input-glow bg-background/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="What's this about?"
                          className="input-glow bg-background/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message <span className="text-destructive">*</span>
                        </label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell us how we can help..."
                          rows={6}
                          required
                          className="input-glow bg-background/50 resize-none"
                        />
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          className="w-full gap-2 glow-box hover:glow-box-intense transition-all"
                          disabled={loading}
                          size="lg"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
