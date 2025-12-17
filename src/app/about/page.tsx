import { Card } from "@/components/ui/card";
import { Target, Heart, Users, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">About Us</h1>
          <p className="text-lg text-muted-foreground">
            Understanding the story behind ATTIHC and what drives us.
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
              <Target className="text-primary" size={28} />
              Our Mission
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              ATTIHC stands for <span className="font-semibold text-primary">&quot;All The Things I Must Remember Today&quot;</span>. 
              We believe that clarity comes from simplicity. In a world filled with countless productivity tools that 
              promise everything, we chose to focus on what truly matters: helping you identify and remember the 
              essential things that will make your day meaningful.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              Our mission is to strip away the complexity and give you a focused, beautiful space to define your day&apos;s 
              priorities. No overwhelming features, no endless lists—just the clarity you need to move forward with purpose.
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
              <Heart className="text-primary" size={28} />
              Why We Built This
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              ATTIHC was born from personal frustration with overcomplicated productivity tools. We found ourselves 
              spending more time managing our task managers than actually getting work done. The endless features, 
              notifications, and complexity became noise rather than clarity.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              We wanted something different—a digital space that feels calm, intentional, and focused. A place where 
              you start each day with just three simple questions: What must I remember? What must I complete? What must I avoid?
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              The result is ATTIHC: a minimalist, beautiful tool that respects your time and helps you build better daily habits.
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
              <Sparkles className="text-primary" size={28} />
              Our Philosophy
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <h3 className="font-semibold text-foreground mb-1">Less is More</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize simplicity over feature bloat. Every element serves a clear purpose.
                </p>
              </div>
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <h3 className="font-semibold text-foreground mb-1">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  Your data stays yours. Everything is stored locally on your device.
                </p>
              </div>
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <h3 className="font-semibold text-foreground mb-1">Beautiful by Design</h3>
                <p className="text-sm text-muted-foreground">
                  Productivity tools don&apos;t have to be boring. We believe in creating delightful experiences.
                </p>
              </div>
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <h3 className="font-semibold text-foreground mb-1">Focus on What Matters</h3>
                <p className="text-sm text-muted-foreground">
                  Not everything deserves your attention. We help you identify the truly important.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
              <Users className="text-primary" size={28} />
              For the Community
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              ATTIHC is built with love for people who value intentionality over busyness, quality over quantity, 
              and peace over chaos. Whether you&apos;re a student, professional, creative, or anyone seeking more clarity 
              in your daily life—we built this for you.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              We&apos;re constantly listening to our community and evolving based on real feedback. If you have ideas, 
              suggestions, or just want to share your story, we&apos;d love to hear from you.
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <p className="text-center text-foreground/80 italic">
            &quot;Simplicity is the ultimate sophistication. Focus on what truly matters, and let everything else fade away.&quot;
          </p>
        </Card>
      </div>
    </div>
  );
}
