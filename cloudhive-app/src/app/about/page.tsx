"use client";

import { IconCloudCode } from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  Shield,
  Zap,
  Layers,
  Users,
  FileText,
  Lock,
  Search,
  Clock,
  Share2,
  Tag,
  Filter,
  Eye,
  Upload,
  Trash2,
  Github,
  Mail,
  Globe,
  Linkedin,
  Code2,
  Sparkles,
  Heart,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
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
              <p className="text-sm text-muted-foreground">About Us</p>
            </div>
          </Link>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section className="p-6 rounded-lg border shadow-xl  backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Our Mission
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              At CloudHive, we're on a mission to simplify cloud storage management. We believe that managing your files across different cloud services should be effortless and intuitive. Our goal is to provide a unified platform that makes cloud storage management accessible to everyone.
            </p>
            <div className="mt-4">
              <a
                href="https://github.com/aerick8602/CloudHive"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                <FileText className="w-3 h-3" />
                <span>View Documentation</span>
              </a>
            </div>
          </section>

          <section className="p-6 rounded-lg border shadow-xl  backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Key Features
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-indigo-100 to-purple-200 dark:from-indigo-900/50 dark:to-purple-800/50 text-indigo-700 dark:text-indigo-300 border-0"
              >
                <Layers className="w-3 h-3 mr-1" />
                Multi-Cloud Support
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-blue-100 to-cyan-200 dark:from-blue-900/50 dark:to-cyan-800/50 text-blue-700 dark:text-blue-300 border-0"
              >
                <Upload className="w-3 h-3 mr-1" />
                Effortless Uploads
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-violet-100 to-purple-200 dark:from-violet-900/50 dark:to-purple-800/50 text-violet-700 dark:text-violet-300 border-0"
              >
                <Share2 className="w-3 h-3 mr-1" />
                Easy Sharing
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-sky-100 to-blue-200 dark:from-sky-900/50 dark:to-blue-800/50 text-sky-700 dark:text-sky-300 border-0"
              >
                <Cloud className="w-3 h-3 mr-1" />
                Backup
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-amber-100 to-orange-200 dark:from-amber-900/50 dark:to-orange-800/50 text-amber-700 dark:text-amber-300 border-0"
              >
                <Lock className="w-3 h-3 mr-1" />
                2FA Protection
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-teal-100 to-emerald-200 dark:from-teal-900/50 dark:to-emerald-800/50 text-teal-700 dark:text-teal-300 border-0"
              >
                <Shield className="w-3 h-3 mr-1" />
                Secure Storage
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-yellow-100 to-amber-200 dark:from-green-900/50 dark:to-amber-800/50 text-yellow-700 dark:text-green-300 border-0"
              >
                <Zap className="w-3 h-3 mr-1" />
                Smart Sync
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-pink-100 to-rose-200 dark:from-pink-900/50 dark:to-rose-800/50 text-pink-700 dark:text-pink-300 border-0"
              >
                <Heart className="w-3 h-3 mr-1" />
                Favorites
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-cyan-100 to-blue-200 dark:from-cyan-900/50 dark:to-blue-800/50 text-cyan-700 dark:text-cyan-300 border-0"
              >
                <Search className="w-3 h-3 mr-1" />
                Advanced Search
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-rose-100 to-red-200 dark:from-rose-900/50 dark:to-red-800/50 text-rose-700 dark:text-rose-300 border-0"
              >
                <Lock className="w-3 h-3 mr-1" />
                Access Control
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-gray-100 to-slate-200 dark:from-gray-900/50 dark:to-slate-800/50 text-gray-700 dark:text-gray-300 border-0"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Unified Bin
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-indigo-100 to-violet-200 dark:from-indigo-900/50 dark:to-violet-800/50 text-indigo-700 dark:text-indigo-300 border-0"
              >
                <Filter className="w-3 h-3 mr-1" />
                Smart Filters
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-emerald-100 to-green-200 dark:from-emerald-900/50 dark:to-green-800/50 text-emerald-700 dark:text-emerald-300 border-0"
              >
                <Eye className="w-3 h-3 mr-1" />
                Quick Preview
              </Badge>
            </div>
          </section>

          <section className="p-6 rounded-lg border shadow-xl  backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Our Technology
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              Built with modern web technologies, CloudHive ensures a secure and efficient experience. We use:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Next.js for a fast and responsive interface</li>
              <li>Google Drive API for seamless integration</li>
              <li>Advanced encryption for data security</li>
              <li>Modern UI/UX design principles</li>
              <li>Real-time updates and notifications</li>
            </ul>
          </section>

          <section className="p-6 rounded-lg border shadow-xl  ">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Our Commitment
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              We are committed to providing a reliable and secure platform for managing your cloud storage. Our focus is on:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>User privacy and data security</li>
              <li>Continuous platform improvements</li>
              <li>Responsive customer support</li>
              <li>Regular feature updates</li>
              <li>Transparent communication</li>
            </ul>
          </section>

          <section className="p-6 rounded-lg border shadow-xl  backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Our Story
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              CloudHive was born from a simple observation: managing files across different cloud services was becoming increasingly complex. As cloud storage became more integral to our digital lives, we saw the need for a unified solution that could simplify this process.
            </p>
            <p className="text-muted-foreground">
              Our journey began with a focus on Google Drive integration, and we've been continuously evolving to meet the growing needs of our users. Today, CloudHive stands as a testament to our commitment to making cloud storage management accessible, secure, and efficient for everyone.
            </p>
          </section>

          <section className="p-6 rounded-lg border shadow-xl  backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Our Vision
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mb-4">
              We envision a future where managing cloud storage is as intuitive as organizing files on your local computer. Our platform is designed to bridge the gap between different cloud services, providing a seamless experience that adapts to your workflow.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Creating a unified interface for all cloud storage needs</li>
              <li>Implementing advanced security measures to protect your data</li>
              <li>Developing innovative features that enhance productivity</li>
              <li>Building a community of users who share our vision</li>
              <li>Continuously improving based on user feedback</li>
            </ul>
          </section>

          <section className="p-6 rounded-lg border shadow-xl  backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Why Choose CloudHive?
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security First
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your data security is our top priority. We implement industry-standard encryption and security measures to ensure your files remain protected.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Performance
                </h3>
                <p className="text-muted-foreground text-sm">
                  Experience lightning-fast file operations with our optimized infrastructure and efficient data handling.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  User-Centric
                </h3>
                <p className="text-muted-foreground text-sm">
                  Built with user feedback at every step, our platform evolves based on real user needs and experiences.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Always Available
                </h3>
                <p className="text-muted-foreground text-sm">
                  Access your files anytime, anywhere. Our platform ensures reliable service with minimal downtime.
                </p>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-lg border shadow-xl  backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary relative inline-block">
              Connect With Us
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
              Have questions or suggestions? We'd love to hear from you. Reach out to us at{" "}
              <a 
                href="mailto:katiyarayush02@gmail.com" 
                className="text-primary hover:underline"
              >
                katiyarayush02@gmail.com
              </a>
              . We're always here to help and improve your CloudHive experience.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col items-center">
          <div className="flex flex-col sm:flex-row justify-between w-full items-center gap-4 sm:gap-0">
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/terms" 
                className="text-primary hover:underline flex items-center gap-2"
              >
                Terms of Service
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
          <div className="text-sm text-muted-foreground text-center mt-4">
            Made with ❤️ by{" "}
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="font-bold cursor-pointer hover:underline">
                  Ayush Katiyar
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Ayush Katiyar</h4>
                    <p className="text-sm text-muted-foreground">
                      Full Stack Developer
                    </p>
                    <div className="flex items-center pt-2">
                      <Mail className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-xs text-muted-foreground">
                        katiyarayush02@gmail.com
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </div>
  );
} 