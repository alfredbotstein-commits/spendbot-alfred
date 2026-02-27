import { Link } from 'react-router-dom';

export function TermsPage() {
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
          Terms of Service
        </h1>
        
        <p className="text-text-muted mb-8">
          Last updated: February 1, 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Agreement to Terms
            </h2>
            <p className="text-text-secondary leading-relaxed">
              By accessing or using SpendBot ("the Service"), you agree to be bound by these Terms 
              of Service. If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Description of Service
            </h2>
            <p className="text-text-secondary leading-relaxed">
              SpendBot is a personal expense tracking application that allows users to manually 
              log their spending, view insights about their financial habits, and set budgeting 
              goals. The Service is provided "as is" and is intended for personal, non-commercial use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              User Accounts
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              When you create an account with us, you must provide accurate and complete information. 
              You are responsible for:
            </p>
            <ul className="text-text-secondary space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>Maintaining the security of your account credentials</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>All activities that occur under your account</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>Notifying us immediately of any unauthorized access</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Free and Premium Tiers
            </h2>
            <div className="bg-surface-raised rounded-xl p-4 space-y-4">
              <div>
                <h3 className="font-medium text-text-primary mb-1">Free Tier</h3>
                <p className="text-text-secondary text-sm">
                  Includes up to 50 expenses per month with basic features. No credit card required.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-text-primary mb-1">Premium (Lifetime)</h3>
                <p className="text-text-secondary text-sm">
                  One-time payment of $4.99 for unlimited expenses and all premium features. 
                  No recurring charges, no subscriptions.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Payment Terms
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              Premium purchases are processed through the Apple App Store or Google Play Store as in-app purchases. By making a purchase, you agree that:
            </p>
            <ul className="text-text-secondary space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>All sales are final and non-refundable, except as required by law</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>The lifetime access is tied to your account, not transferable</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>Prices may change for new customers, but your purchase is locked in</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Acceptable Use
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              You agree not to use SpendBot to:
            </p>
            <ul className="text-text-secondary space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-danger">✕</span>
                <span>Violate any applicable laws or regulations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-danger">✕</span>
                <span>Attempt to gain unauthorized access to our systems</span>
              </li>
              <li className="flex gap-2">
                <span className="text-danger">✕</span>
                <span>Interfere with or disrupt the Service</span>
              </li>
              <li className="flex gap-2">
                <span className="text-danger">✕</span>
                <span>Use automated scripts or bots to access the Service</span>
              </li>
              <li className="flex gap-2">
                <span className="text-danger">✕</span>
                <span>Resell or redistribute the Service without permission</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Your Data
            </h2>
            <p className="text-text-secondary leading-relaxed">
              You retain ownership of all expense data you enter into SpendBot. We claim no 
              intellectual property rights over your data. You can export or delete your data 
              at any time. For details on how we handle your data, please see our{' '}
              <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Disclaimer of Warranties
            </h2>
            <div className="bg-surface-raised rounded-xl p-4">
              <p className="text-text-secondary text-sm leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS 
                OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, 
                OR COMPLETELY SECURE. SPENDBOT IS NOT A FINANCIAL ADVISOR AND DOES NOT PROVIDE 
                FINANCIAL, TAX, OR LEGAL ADVICE. ANY INSIGHTS OR RECOMMENDATIONS ARE FOR 
                INFORMATIONAL PURPOSES ONLY.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Limitation of Liability
            </h2>
            <p className="text-text-secondary leading-relaxed">
              To the maximum extent permitted by law, SpendBot and its operators shall not be 
              liable for any indirect, incidental, special, consequential, or punitive damages, 
              including loss of profits, data, or other intangible losses resulting from your 
              use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Service Modifications
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the Service at any time, 
              with or without notice. We will make reasonable efforts to notify premium users 
              of any significant changes that affect their access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Account Termination
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice, for 
              conduct that we believe violates these Terms or is harmful to other users, us, 
              or third parties. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Changes to Terms
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We reserve the right to update these Terms at any time. We will notify you of 
              significant changes via email or through the app. Your continued use of the 
              Service after changes are posted constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Governing Law
            </h2>
            <p className="text-text-secondary leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of 
              the State of Texas, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Contact Us
            </h2>
            <p className="text-text-secondary leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-surface-raised rounded-xl p-4 mt-3">
              <p className="text-text-secondary">
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@spendbot.app" className="text-accent hover:underline">
                  legal@spendbot.app
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
            <Link to="/privacy" className="text-text-muted hover:text-text-secondary transition-colors">
              Privacy Policy
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
