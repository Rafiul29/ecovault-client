

export default function HelpPage() {
  return (
    <div className="pb-20">
      <div className="bg-muted/30 py-20">
        <div className="wrapper text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Help &amp; Support
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            If you have any questions, encounter issues, or need assistance, please reach out to our support team.
          </p>
        </div>
      </div>
      <div className="wrapper mt-20">
        <div className="space-y-6 text-center">
          <p className="text-lg text-muted-foreground">
            Email: <a href="mailto:support@ecovault.com" className="text-primary hover:underline">support@ecovault.com</a>
          </p>
          <p className="text-lg text-muted-foreground">
            Phone: <a href="tel:+1234567890" className="text-primary hover:underline">+1 (234) 567-890</a>
          </p>
        </div>
      </div>
    </div>
  );
}
