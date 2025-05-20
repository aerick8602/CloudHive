"use client";

import { IconCloudCode } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Globe } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-svh bg-background relative">
      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none select-none z-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[18rem] font-black text-blue-500/8 rotate-[-15deg] flex flex-col items-center gap-0">
            <IconCloudCode className="size-[25rem] -mb-36 -mt-24" />
            CloudHive
          </div>
        </div>
        {/* Cloud Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-400/25 to-indigo-500/35 rounded-full blur-[80px]"></div>
          <div className="absolute top-1/4 -right-40 w-[40rem] h-[40rem] bg-gradient-to-bl from-blue-300/25 to-indigo-400/35 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[40rem] h-[40rem] bg-gradient-to-tr from-blue-400/25 to-indigo-500/35 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-40 right-1/4 w-[40rem] h-[40rem] bg-gradient-to-tl from-blue-300/25 to-indigo-400/35 rounded-full blur-[80px]"></div>
          {/* Additional smaller clouds */}
          <div className="absolute top-1/3 left-1/3 w-[20rem] h-[20rem] bg-gradient-to-br from-blue-300/20 to-indigo-400/30 rounded-full blur-[60px]"></div>
          <div className="absolute bottom-1/3 right-1/3 w-[20rem] h-[20rem] bg-gradient-to-tl from-blue-300/20 to-indigo-400/30 rounded-full blur-[60px]"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/80 text-primary-foreground">
            <IconCloudCode className="size-7" />
          </div>
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <div>
              <span className="text-2xl font-semibold cursor-pointer">CloudHive</span>
              <p className="text-sm text-muted-foreground">Terms of Service</p>
            </div>
          </Link>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section className="p-6 rounded-lg border shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Acceptance of Terms
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              By using CloudHive, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These terms form a legally binding agreement between you and CloudHive. If you do not agree with any of these terms, you must not use our service.
            </p>
            <p className="text-muted-foreground">
              Your continued use of CloudHive after any changes to these terms constitutes your acceptance of the modified terms. We reserve the right to update these terms at any time, and it is your responsibility to review them periodically.
            </p>
          </section>

          <section className="p-6 rounded-lg border shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              What We Do
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              CloudHive is a unified cloud storage management platform that simplifies how you interact with your cloud storage services. Our platform provides a seamless experience for managing your files across different cloud providers.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Connect and manage multiple cloud storage accounts</li>
              <li>Upload, download, and organize files across services</li>
              <li>Share files securely with other users</li>
              <li>Search and manage your cloud storage efficiently</li>
            </ul>
          </section>

          <section className="p-6 rounded-lg border shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Your Responsibilities
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              As a user of CloudHive, you are responsible for maintaining the security and integrity of your account. You must use our service in accordance with these terms and all applicable laws.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Keep your account information accurate and up-to-date</li>
              <li>Protect your account credentials and notify us of any unauthorized access</li>
              <li>Use the service only for lawful purposes</li>
              <li>Respect the rights of other users and third parties</li>
            </ul>
          </section>

          <section className="p-6 rounded-lg border shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Service Rules
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              To ensure a safe and reliable service for all users, we maintain certain rules and restrictions. We may take action, including account suspension, if these rules are violated.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>We may update or modify the service as needed</li>
              <li>Access may be limited to maintain service quality</li>
              <li>Accounts may be suspended for policy violations</li>
              <li>We reserve the right to enforce usage limits</li>
            </ul>
          </section>

          <section className="p-6 rounded-lg border shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <div className="flex flex-wrap gap-4 mb-4">
              <Button
                size="sm"
                className="p-2 bg-gradient-to-r from-gray-200 to-gray-400 text-gray-700 hover:from-gray-300 hover:to-gray-500 flex items-center gap-2"
                asChild
              >
                <a
                  href="https://github.com/aerick8602"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </Button>

              <Button
                size="sm"
                className="p-2 bg-gradient-to-r from-blue-200 to-blue-400 text-blue-700 hover:from-blue-300 hover:to-blue-500 flex items-center gap-2"
                asChild
              >
                <a
                  href="https://www.linkedin.com/in/ayush-katiyar-6a0935238/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </Button>

              <Button
                size="sm"
                className="p-2 bg-gradient-to-r from-indigo-200 to-indigo-400 text-indigo-700 hover:from-indigo-300 hover:to-indigo-500 flex items-center gap-2"
                asChild
              >
                <a
                  href="https://portfolio-desr.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                  aria-label="Portfolio"
                >
                  <Globe className="w-4 h-4" />
                  <span>Portfolio</span>
                </a>
              </Button>
            </div>
            <p className="text-muted-foreground">
              For any questions or concerns about these terms, please contact us at{" "}
              <a 
                href="mailto:katiyarayush02@gmail.com" 
                className="text-primary hover:underline"
              >
                katiyarayush02@gmail.com
              </a>
              . We aim to respond to all inquiries promptly and will work to address any issues you may have with our service.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col items-center">
          <div className="flex flex-col sm:flex-row justify-between w-full items-center gap-4 sm:gap-0">
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/about" 
                className="text-primary hover:underline flex items-center gap-2"
              >
                About Us
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link 
                href="/privacy" 
                className="text-primary hover:underline flex items-center gap-2"
              >
                Privacy Policy
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">Version 1.1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
} 