"use client";

import { IconCloudCode } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Globe } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-svh bg-background relative">
      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none select-none z-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[18rem] font-black text-muted-foreground/10 rotate-[-15deg] flex flex-col items-center gap-0">
            <IconCloudCode className="size-[25rem] -mb-36 -mt-24" />
            CloudHive
          </div>
        </div>
        {/* Cloud Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-gradient-to-br from-muted/25 to-muted/35 rounded-full blur-[80px]"></div>
          <div className="absolute top-1/4 -right-40 w-[40rem] h-[40rem] bg-gradient-to-bl from-muted/25 to-muted/35 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[40rem] h-[40rem] bg-gradient-to-tr from-muted/25 to-muted/35 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-40 right-1/4 w-[40rem] h-[40rem] bg-gradient-to-tl from-muted/25 to-muted/35 rounded-full blur-[80px]"></div>
          {/* Additional smaller clouds */}
          <div className="absolute top-1/3 left-1/3 w-[20rem] h-[20rem] bg-gradient-to-br from-muted/20 to-muted/30 rounded-full blur-[60px]"></div>
          <div className="absolute bottom-1/3 right-1/3 w-[20rem] h-[20rem] bg-gradient-to-tl from-muted/20 to-muted/30 rounded-full blur-[60px]"></div>
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
              <p className="text-sm text-muted-foreground">Privacy Policy</p>
            </div>
          </Link>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section className="p-6 rounded-lg border shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Information We Collect
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              At CloudHive, we collect only the information necessary to provide and improve our service. We are committed to transparency about how we handle your data and ensuring your privacy is protected.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Account details: email address and name for account management</li>
              <li>Cloud storage tokens: to connect and manage your Google Drive</li>
            </ul>
          </section>

          <section className="p-6 rounded-lg border shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              How We Use Your Information
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              We use your information solely to provide and enhance our cloud storage management service. Your data helps us create a better experience while maintaining the security and functionality of our platform.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide and maintain our Google Drive management service</li>
              <li>To secure your account and protect your data</li>
              <li>To communicate important updates about our service</li>
            </ul>
          </section>

          <section className="p-6 rounded-lg border shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Data Security
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              We take the security of your information seriously. Our security measures are designed to protect your data from unauthorized access, alteration, or disclosure while maintaining the functionality of our service.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Secure encrypted connections for all data transfers</li>
              <li>Protected storage of cloud service access tokens</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls to protect your information</li>
            </ul>
          </section>

          <section className="p-6 rounded-lg border shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Third-Party Services
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              CloudHive integrates with Google Drive to provide a seamless storage management experience. While we maintain our own privacy standards, we recommend reviewing Google Drive's privacy policy for complete information about their data practices.
            </p>
            <p className="text-muted-foreground">
              Your use of Google Drive through CloudHive is subject to Google's terms of service and privacy policy. We recommend familiarizing yourself with these policies to understand how your data is handled.
            </p>
          </section>

          <section className="p-6 rounded-lg border shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Your Rights
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              We respect your rights regarding your personal information. You have control over your data and how it's used within our service. We're committed to helping you exercise these rights easily and effectively.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access and review your account information</li>
              <li>Update or correct your personal details</li>
              <li>Delete your account and associated data</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section className="p-6 rounded-lg border shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <div className="flex flex-wrap gap-3 md:gap-5 mb-4">
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
              If you have any questions about our privacy practices or how we handle your data, please contact us at{" "}
              <a 
                href="mailto:katiyarayush02@gmail.com" 
                className="text-primary hover:underline"
              >
                katiyarayush02@gmail.com
              </a>
              . We're here to help and will respond to your privacy-related inquiries as quickly as possible.
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
                href="/terms" 
                className="text-primary hover:underline flex items-center gap-2"
              >
                Terms of Service
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