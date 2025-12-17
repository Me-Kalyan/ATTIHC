import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="grid gap-6 max-w-2xl mx-auto">
      <Card className="p-4 shadow-sm border border-border space-y-3">
        <h1 className="h1">Page not found</h1>
        <p className="text-sm text-muted-foreground">The page you are looking for does not exist.</p>
        <a href="/" className="text-sm underline underline-offset-4">
          Go to Today
        </a>
      </Card>
    </div>
  );
}
