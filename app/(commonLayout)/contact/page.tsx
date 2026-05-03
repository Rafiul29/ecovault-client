"use client";
import { toast } from "sonner";
import { Metadata } from "next";
import { Mail, MapPin, Phone, Send } from "lucide-react";


export default function ContactPage() {
  return (
    <div className="pb-20">
      <div className="bg-muted/30 py-10 md:py-16">
        <div className="wrapper text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions, feedback, or want to partner with us? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="wrapper mt-5 md:mt-10">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground text-lg">
                Our team is always ready to help. Reach out through any of the channels below and we'll get back to you as soon as possible.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Email Us</h3>
                  <p className="text-muted-foreground mb-1">For general inquiries and support.</p>
                  <a href="mailto:hello@ecovault.com" className="text-primary hover:underline font-medium">hello@ecovault.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Visit Us</h3>
                  <p className="text-muted-foreground mb-1">Our headquarters.</p>
                  <address className="not-italic text-card-foreground font-medium">
                    123 Innovation Drive<br />
                    Sustainability Park, SF 94105<br />
                    United States
                  </address>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Call Us</h3>
                  <p className="text-muted-foreground mb-1">Mon-Fri from 9am to 6pm (PST).</p>
                  <a href="tel:+1234567890" className="text-primary hover:underline font-medium">+1 (234) 567-890</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
            <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const data = {
                firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value.trim(),
                lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value.trim(),
                email: (form.elements.namedItem('email') as HTMLInputElement).value.trim(),
                subject: (form.elements.namedItem('subject') as HTMLInputElement).value.trim(),
                message: (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim(),
              };
              if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
                toast.error('Please fill out all fields.');
                return;
              }
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(data.email)) {
                toast.error('Please enter a valid email address.');
                return;
              }
              toast.success('Message sent!');
            }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="jane@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="How can we help?"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Tell us a little about your project or inquiry..."
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2.5 font-medium transition-colors"
              >
                <Send className="size-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
