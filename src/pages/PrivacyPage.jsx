import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-2 text-text-primary hover:text-accent transition-colors"
          >
            <span className="text-2xl">🤖</span>
            <span className="font-heading font-bold">SpendBot</span>
          </Link>
          <Link
            to="/"
            className="text-accent text-sm font-medium"
          >
            ← Back to App
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Privacy Policy
        </h1>
        
        <p className="text-text-muted mb-8">
          Last updated: February 1, 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Overview
            </h2>
            <p className="text-text-secondary leading-relaxed">
              SpendBot ("we", "our", or "us") respects your privacy and is committed to protecting 
              your personal data. This privacy policy explains how we collect, use, and safeguard 
              your information when you use our expense tracking application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Information We Collect
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              We collect only the minimum information necessary to provide our service:
            </p>
            <ul className="text-text-secondary space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Account Information:</strong> Email address and authentication credentials when you sign up</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Expense Data:</strong> The amounts, categories, and dates you enter into the app</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Preferences:</strong> Your app settings, budget goals, and display preferences</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Device Information:</strong> Basic device type and operating system for app compatibility</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              How We Use Your Information
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              Your data is used solely to provide and improve SpendBot's features:
            </p>
            <ul className="text-text-secondary space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>Calculate spending insights and trends</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>Sync your data across your devices</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>Personalize your experience and recommendations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>Send important account notifications</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              What We Never Do
            </h2>
            <div className="bg-surface-raised rounded-xl p-4 space-y-2">
              <p className="text-text-secondary flex gap-2">
                <span className="text-danger">✕</span>
                <span>We <strong>never sell</strong> your data to third parties</span>
              </p>
              <p className="text-text-secondary flex gap-2">
                <span className="text-danger">✕</span>
                <span>We <strong>never share</strong> your financial information with advertisers</span>
              </p>
              <p className="text-text-secondary flex gap-2">
                <span className="text-danger">✕</span>
                <span>We <strong>never use</strong> your data for targeted advertising</span>
              </p>
              <p className="text-text-secondary flex gap-2">
                <span className="text-danger">✕</span>
                <span>We <strong>never connect</strong> to your bank accounts or credit cards</span>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Data Storage and Security
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Your data is stored securely on Supabase servers located in the United States. 
              All data is encrypted both at rest and in transit using industry-standard encryption 
              protocols. We implement appropriate technical and organizational measures to protect 
              your personal data against unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Third-Party Services
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              We use the following third-party services to operate SpendBot:
            </p>
            <ul className="text-text-secondary space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Supabase:</strong> Database hosting and user authentication</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Google Sign-In:</strong> Optional authentication method</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Apple Sign-In:</strong> Optional authentication method</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Stripe:</strong> Secure payment processing (we never see your card details)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Netlify:</strong> Web hosting and deployment</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Your Rights
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              You have the following rights regarding your personal data:
            </p>
            <ul className="text-text-secondary space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-success">✓</span>
                <span><strong>Access:</strong> Request a copy of your data at any time</span>
              </li>
              <li className="flex gap-2">
                <span className="text-success">✓</span>
                <span><strong>Export:</strong> Download your expense data in CSV format</span>
              </li>
              <li className="flex gap-2">
                <span className="text-success">✓</span>
                <span><strong>Correction:</strong> Update or correct any inaccurate information</span>
              </li>
              <li className="flex gap-2">
                <span className="text-success">✓</span>
                <span><strong>Deletion:</strong> Delete your account and all associated data</span>
              </li>
            </ul>
            <p className="text-text-secondary leading-relaxed mt-3">
              You can exercise these rights directly in the app settings, or by contacting us at{' '}
              <a href="mailto:privacy@spendbot.app" className="text-accent hover:underline">
                privacy@spendbot.app
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Data Retention
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We retain your data for as long as your account is active. If you delete your account, 
              we will delete all associated data within 30 days. Some data may be retained longer 
              if required by law or for legitimate business purposes (such as resolving disputes).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Children's Privacy
            </h2>
            <p className="text-text-secondary leading-relaxed">
              SpendBot is not intended for children under the age of 13. We do not knowingly 
              collect personal information from children under 13. If you believe we have 
              collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Changes to This Policy
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any 
              significant changes by email or through the app. Your continued use of SpendBot 
              after such modifications constitutes your acknowledgment of the modified policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Contact Us
            </h2>
            <p className="text-text-secondary leading-relaxed">
              If you have any questions about this privacy policy or our data practices, 
              please contact us at:
            </p>
            <div className="bg-surface-raised rounded-xl p-4 mt-3">
              <p className="text-text-secondary">
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@spendbot.app" className="text-accent hover:underline">
                  privacy@spendbot.app
                </a>
              </p>
              <p className="text-text-secondary mt-2">
                <strong>Address:</strong> Austin, TX, United States
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 mt-12">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-text-muted">
            <span>🤖</span>
            <span>© 2026 SpendBot</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/terms" className="text-text-muted hover:text-text-secondary transition-colors">
              Terms of Service
            </Link>
            <a href="mailto:support@spendbot.app" className="text-text-muted hover:text-text-secondary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
