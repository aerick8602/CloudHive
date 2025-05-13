import { DriveContent } from "@/components/content/DriveContent";
import { RecentContent } from "@/components/content/RecentContent";
import { StarredContent } from "@/components/content/StarredContent";
import { TrashContent } from "@/components/content/TrashContent";
import { StorageContent } from "@/components/content/StorageContent";
import { ImageContent } from "@/components/content/ImageContent";
import { VideoContent } from "@/components/content/VideoContent";
import { AudioContent } from "@/components/content/AudioContent";
import { DocumentContent } from "@/components/content/DocumentContent";
import { TextContent } from "@/components/content/TextContent";
import { ArchiveContent } from "@/components/content/ArchiveContent";

import SettingsAccount from "@/components/content/setting/SettingsAccount";
import ProfileContent from "@/components/content/ProfileContent";

// Flat mapping from tab title to content component
const contentMap: Record<string, React.ComponentType<any>> = {
  Drive: DriveContent,
  Recent: RecentContent,
  Starred: StarredContent,
  Trash: TrashContent,
  Storage: StorageContent,
  Images: ImageContent,
  Videos: VideoContent,
  Audio: AudioContent,
  Documents: DocumentContent,
  Text: TextContent,
  Archives: ArchiveContent,
  Profile: ProfileContent,
  Accounts: SettingsAccount,
};

export { contentMap };
