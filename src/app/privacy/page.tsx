import { Card } from "@/components/ui/card";
import { Lock, Database, Eye, Shield, Cookie } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: December 17, 2025
          </p>
        </div>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Lock className="text-primary mt-1 flex-shrink-0" size={20} />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Your Privacy is Our Priority</p>
              <p className="text-sm text-foreground/90">
                ATTIHC is built with privacy at its core. All your data is stored locally on your device, 
                and we never transmit your personal tasks, notes, or information to external servers.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
              <Database className="text-primary" size={28} />
              1. Data Storage and Collection
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              ATTIHC stores all user-generated content (tasks, notes, settings, history) locally in your 
              browser&apos;s localStorage. This means:
            </p>
            <div className="space-y-2 ml-4">
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <p className="text-base text-foreground/80">
                  Your data never leaves your device unless you explicitly enable sync features
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <p className="text-base text-foreground/80">
                  We cannot access, read, or view your personal tasks and notes
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <p className="text-base text-foreground/80">
                  Your data remains on your device even when offline
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <p className="text-base text-foreground/80">
                  Clearing your browser data will permanently delete all stored information
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
              <Eye className="text-primary" size={28} />
              2. What We Don&apos;t Collect
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              Unlike many productivity apps, ATTIHC does not collect:
            </p>
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <p className="text-sm font-semibold text-foreground">Personal Information</p>
                <p className="text-xs text-muted-foreground mt-1">No names, emails, or contact details</p>
              </div>
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <p className="text-sm font-semibold text-foreground">Task Content</p>
                <p className="text-xs text-muted-foreground mt-1">Your tasks and notes stay private</p>
              </div>
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <p className="text-sm font-semibold text-foreground">Location Data</p>
                <p className="text-xs text-muted-foreground mt-1">We don&apos;t track where you are</p>
              </div>
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <p className="text-sm font-semibold text-foreground">Device Information</p>
                <p className="text-xs text-muted-foreground mt-1">No fingerprinting or tracking</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
              <Cookie className="text-primary" size={28} />
              3. Cookies and Browser Storage
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              ATTIHC uses browser localStorage to save your preferences, tasks, and application state. 
              This is essential for the app to function properly.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              We do not use tracking cookies or third-party analytics. The only data stored is what&apos;s 
              necessary for the application to remember your settings and tasks between sessions.
            </p>
            <div className="bg-secondary/30 border border-border/40 rounded-lg p-4 mt-4">
              <p className="text-sm text-foreground/80">
                <span className="font-semibold">Technical Note:</span> localStorage is a browser feature 
                that allows websites to store data locally. You can clear this data anytime through your 
                browser&apos;s settings.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
              <Shield className="text-primary" size={28} />
              4. Data Security
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              Since all data is stored locally on your device, the security of your information depends on 
              your device&apos;s security measures. We recommend:
            </p>
            <div className="space-y-3 mt-4">
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <h3 className="font-semibold text-foreground mb-1">Use Device Lock</h3>
                <p className="text-sm text-muted-foreground">
                  Protect your device with a strong password, PIN, or biometric lock.
                </p>
              </div>
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <h3 className="font-semibold text-foreground mb-1">Enable Passcode Protection</h3>
                <p className="text-sm text-muted-foreground">
                  ATTIHC offers an optional passcode feature for additional security within the app.
                </p>
              </div>
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <h3 className="font-semibold text-foreground mb-1">Regular Backups</h3>
                <p className="text-sm text-muted-foreground">
                  Use the export feature to back up your data regularly.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              5. Third-Party Services
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              ATTIHC does not integrate with third-party services by default. If we introduce optional 
              integrations in the future (such as cloud sync), we will:
            </p>
            <div className="space-y-2 ml-4 mt-3">
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <p className="text-base text-foreground/80">Make them completely optional</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <p className="text-base text-foreground/80">Clearly disclose what data is shared</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <p className="text-base text-foreground/80">Update this Privacy Policy accordingly</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <p className="text-base text-foreground/80">Require explicit user consent</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              6. Children&apos;s Privacy
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              ATTIHC is suitable for users of all ages. Since we don&apos;t collect any personal information, 
              we do not knowingly collect data from children under 13. Parents and guardians are encouraged 
              to supervise their children&apos;s use of the application.
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              7. Your Rights and Choices
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              You have complete control over your data:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Access Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  All your data is visible within the app. Use the export feature to download a copy.
                </p>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Delete Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Clear your browser&apos;s localStorage or use the app&apos;s reset feature to delete everything.
                </p>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Export Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Download your tasks and history anytime as a JSON or CSV file.
                </p>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Modify Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Customize privacy settings including passcode protection and data visibility.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              8. Changes to This Policy
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or 
              for legal reasons. We will notify users of any significant changes by updating the &quot;Last 
              updated&quot; date at the top of this page.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              Continued use of ATTIHC after changes to this policy constitutes acceptance of those changes.
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              9. Contact Us
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy or how we handle data, 
              please reach out through our Contact page. We&apos;re committed to transparency and will respond 
              to your inquiries promptly.
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-secondary/30 border-border/40">
          <p className="text-sm text-center text-muted-foreground">
            <span className="font-semibold text-foreground">Bottom line:</span> Your data is yours. 
            We don&apos;t collect it, we don&apos;t see it, and we don&apos;t share it. ATTIHC is designed to respect 
            your privacy completely.
          </p>
        </Card>
      </div>
    </div>
  );
}
