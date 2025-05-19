import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Github,
  Mail,
  Globe,
  Linkedin,
  Code2,
  Sparkles,
  Heart,
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
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { IconExternalLink } from "@tabler/icons-react";

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportDialog({ open, onOpenChange }: SupportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            About CloudHive
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <span>
              CloudHive is a unified cloud storage management platform that lets
              you manage all your cloud accounts in one place. Seamlessly
              connect and access multiple storage services through a single,
              intuitive interface making file organization and access easier
              than ever.{" "}
              <a
                href="https://github.com/aerick8602/CloudHive"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors ml-1"
              >
                <FileText className="w-3 h-3" />
                <span>Docs</span>
              </a>
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 -mt-2">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2 text-base">
              <Cloud className="w-5 h-5 text-blue-500" />
              Key Features
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-indigo-100 to-purple-200 dark:from-indigo-900/50 dark:to-purple-800/50 text-indigo-700 dark:text-indigo-300 border-0"
              >
                <Layers className="w-3 h-3 " />
                Multi-Cloud Support
              </Badge>

              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-cyan-100 to-blue-200 dark:from-cyan-900/50 dark:to-blue-800/50 text-cyan-700 dark:text-cyan-300 border-0"
              >
                <Search className="w-3 h-3 " />
                Advanced Search
              </Badge>

              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-violet-100 to-purple-200 dark:from-violet-900/50 dark:to-purple-800/50 text-violet-700 dark:text-violet-300 border-0"
              >
                <Share2 className="w-3 h-3 " />
                Easy Sharing
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-sky-100 to-blue-200 dark:from-sky-900/50 dark:to-blue-800/50 text-sky-700 dark:text-sky-300 border-0"
              >
                <Cloud className="w-3 h-3 " />
                Backup
              </Badge>

              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-amber-100 to-orange-200 dark:from-amber-900/50 dark:to-orange-800/50 text-amber-700 dark:text-amber-300 border-0"
              >
                <Lock className="w-3 h-3 " />
                2FA Protection
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-teal-100 to-emerald-200 dark:from-teal-900/50 dark:to-emerald-800/50 text-teal-700 dark:text-teal-300 border-0"
              >
                <Shield className="w-3 h-3 " />
                Secure Storage
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-yellow-100 to-amber-200 dark:from-green-900/50 dark:to-amber-800/50 text-yellow-700 dark:text-green-300 border-0"
              >
                <Zap className="w-3 h-3 " />
                Smart Sync
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-pink-100 to-rose-200 dark:from-pink-900/50 dark:to-rose-800/50 text-pink-700 dark:text-pink-300 border-0"
              >
                <Heart className="w-3 h-3 " />
                Favorites
              </Badge>

              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-rose-100 to-red-200 dark:from-rose-900/50 dark:to-red-800/50 text-rose-700 dark:text-rose-300 border-0"
              >
                <Lock className="w-3 h-3 " />
                Access Control
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2 text-base">
              <Code2 className="w-5 h-5 text-red-500" />
              Connect
            </h4>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="p-2 bg-gradient-to-r from-gray-200 to-gray-400 text-gray-700 hover:from-gray-300 hover:to-gray-500"
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
                </a>
              </Button>
              <Button
                size="sm"
                className="p-2 bg-gradient-to-r from-blue-200 to-blue-400 text-blue-700 hover:from-blue-300 hover:to-blue-500"
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
                </a>
              </Button>
              <Button
                size="sm"
                className="p-2 bg-gradient-to-r from-red-200 to-red-400 text-red-700 hover:from-red-300 hover:to-red-500"
                asChild
              >
                <a
                  href="mailto:katiyarayush02@gmail.com"
                  className="flex items-center justify-center"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </Button>
              <Button
                size="sm"
                className="p-2 bg-gradient-to-r from-indigo-200 to-indigo-400 text-indigo-700 hover:from-indigo-300 hover:to-indigo-500"
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
                </a>
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium flex items-center gap-2 text-base">
              <Tag className="w-5 h-5 text-green-500" />
              Version
            </h4>
            <p className="text-xs text-muted-foreground">CloudHive v1.0.0</p>
          </div>

          <div className="pt-1 text-xs text-muted-foreground text-center">
            Made with ❤️ by{" "}
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="font-bold cursor-pointer hover:underline ">
                  Ayush Katiyar
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold ">Ayush Katiyar</h4>
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
      </DialogContent>
    </Dialog>
  );
}
