
export default function PrivacyPage() {
  return (
    <div className="pb-20">
      <section className="bg-muted/30 py-20">
        <div className="wrapper text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. Read how we handle your data.
          </p>
        </div>
      </section>

      <div className="wrapper mt-20 space-y-6">
        <section className="text-lg text-muted-foreground">
          <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
          <p>
            We collect only the information necessary to provide and improve the
            EcoVault service, such as account details, usage analytics, and
            communication preferences.
          </p>
        </section>

        <section className="text-lg text-muted-foreground">
          <h2 className="text-2xl font-semibold mb-4">Data Usage</h2>
          <p>
            Collected data is used to operate the platform, personalize your
            experience, send important updates, and comply with legal obligations.
          </p>
        </section>

        <section className="text-lg text-muted-foreground">
          <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
          <p>
            We implement industry‑standard security measures and encryption to
            protect your data from unauthorized access.
          </p>
        </section>

        <section className="text-lg text-muted-foreground">
          <h2 className="text-2xl font-semibold mb-4">Payment Data</h2>
            <p>
              We securely store payment‑related information, including:
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Transaction ID (unique identifier for each payment)</li>
                <li>Payment method (e.g., sslcommerz, stripe, bKash)</li>
                <li>Raw gateway response data (JSON) for troubleshooting</li>
                <li>Payment amount, status (PENDING, SUCCESS, FAILED) and timestamps</li>
                <li>Associated subscription plan details (tier, duration, price)</li>
              </ul>
              This data is retained solely for processing, billing, and compliance purposes and is protected according to industry‑standard security practices.
            </p>
        </section>
        
        <section className="text-lg text-muted-foreground">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your personal
            data by contacting us at{" "}
            <a
              href="mailto:privacy@ecovault.com"
              className="text-primary hover:underline"
            >
              privacy@ecovault.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
