'use client';
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitted(true);
    toast("Message Sent! — Thank you for contacting us. We'll get back to you soon.", {
      variant: "success",
      icon: "check",
      duration: 3000,
    });

    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email Us</h3>
                  <p className="text-sm text-muted-foreground">support@attihc.com</p>
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                For general inquiries, support requests, or partnership opportunities, feel free to 
                reach out via email.
              </p>
            </div>
          </Card>

          <Card className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Feedback</h3>
                  <p className="text-sm text-muted-foreground">We value your input</p>
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Have suggestions for new features or improvements? We're always listening to our 
                community and evolving based on your feedback.
              </p>
            </div>
          </Card>
        </div>

        <Card className="p-8">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <CheckCircle2 size={48} className="text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-foreground">Message Sent Successfully!</h3>
              <p className="text-center text-muted-foreground max-w-md">
                Thank you for reaching out. We've received your message and will get back to you within 
                24-48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-bold text-foreground">Send us a message</h2>
                <p className="text-sm text-muted-foreground">
                  Fill out the form below and we'll be in touch soon.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="What's this about?"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all resize-none text-foreground placeholder:text-muted-foreground"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <Button type="submit" className="w-full md:w-auto flex items-center gap-2">
                <Send size={16} />
                Send Message
              </Button>
            </form>
          )}
        </Card>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Quick Response Tips</h3>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Be specific about your issue or question to help us assist you better</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Include relevant details like browser type or device for technical issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Check your spam folder if you don't receive a response within 48 hours</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
