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

// Explicitly define the type for the components
const contentArray: Record<string, Record<string, React.ComponentType<any>>> = {
  main: {
    Drive: DriveContent,
    Recent: RecentContent,
    Starred: StarredContent,
    Trash: TrashContent,
    Storage: StorageContent,
  },
  explorer: {
    Images: ImageContent,
    Videos: VideoContent,
    Audio: AudioContent,
    Documents: DocumentContent,
    Text: TextContent,
    Archives: ArchiveContent,
  },
};

export { contentArray };
