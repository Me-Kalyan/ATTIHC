import { Card } from "@/components/ui/card";
import { FileText, Shield, AlertCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: December 17, 2025
          </p>
        </div>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-primary mt-1 flex-shrink-0" size={20} />
            <p className="text-sm text-foreground/90">
              Please read these terms carefully before using ATTIHC. By accessing or using our service, 
              you agree to be bound by these terms.
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
              <FileText className="text-primary" size={28} />
              1. Acceptance of Terms
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              By accessing and using ATTIHC (&quot;the Service&quot;), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to these Terms of Service, please do not 
              use the Service.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              We reserve the right to update and change the Terms of Service without notice. Continued use 
              of the Service after any such changes shall constitute your consent to such changes.
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              2. Description of Service
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              ATTIHC is a minimalist productivity tool designed to help users organize and prioritize their 
              daily tasks. The Service includes features such as daily task management, focus timers, notes, 
              and other productivity-enhancing tools.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              All data created and stored through ATTIHC is stored locally on your device. We do not sync 
              or store your personal data on external servers unless explicitly enabled by you.
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
              <Shield className="text-primary" size={28} />
              3. User Responsibilities
            </h2>
            <div className="space-y-3">
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <h3 className="font-semibold text-foreground mb-1">Account Security</h3>
                <p className="text-sm text-muted-foreground">
                  You are responsible for maintaining the security of any passcodes or security measures 
                  you enable within the Service.
                </p>
              </div>
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <h3 className="font-semibold text-foreground mb-1">Acceptable Use</h3>
                <p className="text-sm text-muted-foreground">
                  You agree not to use the Service for any unlawful purpose or in any way that could damage, 
                  disable, or impair the Service.
                </p>
              </div>
              <div className="border-l-4 border-primary/40 pl-4 py-2">
                <h3 className="font-semibold text-foreground mb-1">Data Backup</h3>
                <p className="text-sm text-muted-foreground">
                  You are responsible for backing up your own data. While we strive to provide reliable local 
                  storage, we are not responsible for any data loss.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              4. Intellectual Property
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              The Service and its original content, features, and functionality are owned by ATTIHC and are 
              protected by international copyright, trademark, patent, trade secret, and other intellectual 
              property or proprietary rights laws.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              You retain all rights to the data and content you create using the Service. We do not claim 
              ownership of your personal tasks, notes, or any other content you generate.
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              5. Limitation of Liability
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              ATTIHC is provided &quot;as is&quot; without warranty of any kind. We make no warranties, expressed or 
              implied, regarding the Service&apos;s reliability, accuracy, or availability.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              In no event shall ATTIHC, its directors, employees, partners, or affiliates be liable for any 
              indirect, incidental, special, consequential, or punitive damages, including loss of data, use, 
              or profits, arising out of or in any way connected with the use of the Service.
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              6. Privacy and Data Protection
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
              your information. By using the Service, you agree to our data practices as described in our 
              Privacy Policy.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              Since ATTIHC stores data locally on your device, you maintain complete control over your 
              information at all times.
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              7. Modifications to the Service
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any 
              part thereof) with or without notice at any time.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              We shall not be liable to you or any third party for any modification, suspension, or 
              discontinuance of the Service.
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              8. Termination
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              You may stop using the Service at any time. Since all data is stored locally, you can clear 
              your browser data to completely remove all information associated with the Service.
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">
              We reserve the right to refuse service to anyone for any reason at any time, though we aim to 
              provide an inclusive and welcoming environment for all users.
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              9. Governing Law
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
              in which ATTIHC operates, without regard to its conflict of law provisions.
            </p>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              10. Contact Information
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through our Contact 
              page. We&apos;re happy to clarify any concerns you may have.
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-secondary/30 border-border/40">
          <p className="text-sm text-center text-muted-foreground">
            By using ATTIHC, you acknowledge that you have read, understood, and agree to be bound by these 
            Terms of Service.
          </p>
        </Card>
      </div>
    </div>
  );
}
