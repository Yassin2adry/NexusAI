import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 gradient-text">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 2024</p>
          </div>

          <div className="glass-panel p-8 space-y-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <section>
              <h2 className="text-3xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using NexusAI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">2. Use License</h2>
              <p className="text-muted-foreground mb-4">
                Permission is granted to temporarily access and use NexusAI for personal, non-commercial purposes. This license does not include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Modifying or copying the service materials</li>
                <li>Using the materials for commercial purposes without authorization</li>
                <li>Attempting to reverse engineer any software</li>
                <li>Removing copyright or proprietary notations</li>
                <li>Transferring materials to another person</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">3. User Account</h2>
              <p className="text-muted-foreground mb-4">
                To use certain features, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Not create multiple accounts to abuse our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">4. Credits and Payments</h2>
              <p className="text-muted-foreground mb-4">
                NexusAI operates on a credit-based system:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Credits are required to use AI features</li>
                <li>Credits can be earned through daily login bonuses and achievements</li>
                <li>Credits can be purchased through our pricing plans</li>
                <li>Credits are non-refundable once purchased</li>
                <li>Unused credits do not expire but may be subject to account inactivity policies</li>
                <li>We reserve the right to adjust credit costs for features with notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">5. Content Ownership</h2>
              <p className="text-muted-foreground mb-4">
                Regarding content created using NexusAI:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>You retain ownership of games and content you create</li>
                <li>You grant us license to store and process your content to provide services</li>
                <li>We may use anonymized data to improve our AI models</li>
                <li>You are responsible for ensuring your content complies with Roblox Terms of Service</li>
                <li>We are not liable for any copyright infringement in user-generated content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">6. Prohibited Uses</h2>
              <p className="text-muted-foreground mb-4">
                You may not use NexusAI to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Create content that violates any laws or regulations</li>
                <li>Generate malicious code or exploits</li>
                <li>Abuse, harass, or harm other users</li>
                <li>Circumvent our credit or payment systems</li>
                <li>Overload or disrupt our services</li>
                <li>Collect user data without consent</li>
                <li>Impersonate others or misrepresent affiliation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">7. Service Availability</h2>
              <p className="text-muted-foreground">
                We strive to provide reliable service but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any aspect of the service with or without notice. We are not liable for any service interruptions or data loss.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                NexusAI and its owners shall not be liable for any damages arising from the use or inability to use our service, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">9. Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason in our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. We will notify users of material changes. Continued use of the service after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">12. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-primary font-semibold mt-2">
                yassin.kadry@icloud.com
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
