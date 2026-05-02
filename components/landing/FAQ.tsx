"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is EcoVault?",
    answer: "EcoVault is a platform dedicated to fostering sustainable innovations. It allows innovators to share eco-friendly ideas, collaborate with a community of like-minded individuals, and potentially secure funding or support for their projects."
  },
  {
    question: "Who can submit an idea?",
    answer: "Anyone with a passion for sustainability can submit an idea! Whether you're a student, professional, or simply an eco-enthusiast with a brilliant concept, we welcome all viable solutions that aim to protect our environment."
  },
  {
    question: "How do I participate in the community?",
    answer: "You can participate by exploring ideas, upvoting concepts you believe in, joining discussions in the comments, and sharing your insights. Engaging with the community helps refine ideas and push them closer to reality."
  },
  {
    question: "Is there a cost to use EcoVault?",
    answer: "Creating an account and exploring the platform is entirely free. Certain premium features or accessing exclusive funded project details may require a subscription or one-time payment, but the core community experience remains open to everyone."
  },
  {
    question: "How are ideas protected?",
    answer: "We take intellectual property seriously. While sharing ideas publicly always carries some risk, our platform allows you to choose what details to reveal. We encourage sharing the 'what' and 'why' while keeping the core proprietary 'how' confidential until you secure proper protections or partnerships."
  },
  {
    question: "How does the funding or support process work?",
    answer: "Innovators can apply for funding or support directly through the platform. Once an idea gains traction and meets certain criteria, it becomes eligible for review by our panel of investors and expert mentors. Successful projects receive funding, mentorship, and resources to help bring their ideas to life."
  },
  {
    question: "What happens to my idea after submission?",
    answer: "Once submitted, your idea is reviewed by our community and experts. It goes through stages of evaluation, feedback, and potential improvement. Ideas that gain significant support and validation may be featured, funded, or developed into real-world projects with the help of our resources."
  },
  {
    question: "Can I edit or update my idea after publishing?",
    answer: "Yes, you can edit and update your idea as needed. We encourage innovators to refine their concepts based on community feedback and new insights. You can make changes to your description, images, or other details at any time."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 bg-primary/5 blur-[120px] rounded-full" />

      <div className="mx-auto max-w-4xl px-2 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary font-semibold tracking-wide text-sm uppercase mb-3">Questions & Answers</h2>
          <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about the platform and how it works.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                "border border-border rounded-2xl overflow-hidden transition-all duration-200 bg-card",
                openIndex === index ? "ring-2 ring-primary/20 shadow-md" : "hover:border-primary/30"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
              >
                <span className="font-semibold text-foreground pr-8">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "size-5 text-muted-foreground transition-transform duration-300 shrink-0",
                    openIndex === index ? "rotate-180 text-primary" : ""
                  )}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5 pt-0 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
