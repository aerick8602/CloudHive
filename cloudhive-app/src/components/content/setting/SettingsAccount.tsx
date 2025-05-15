import { useState } from "react";
import {
  IconBrandDiscord,
  IconBrandDocker,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandGmail,
  IconBrandMedium,
  IconBrandNotion,
  IconBrandSkype,
  IconBrandSlack,
  IconBrandStripe,
  IconBrandTelegram,
  IconBrandTrello,
  IconBrandWhatsapp,
  IconBrandZoom,
} from "@tabler/icons-react";
const apps = [
  {
    name: "Telegram",
    logo: <IconBrandTelegram />,
    connected: false,
    desc: "Connect with Telegram for real-time communication.",
  },
  {
    name: "Notion",
    logo: <IconBrandNotion />,
    connected: true,
    desc: "Effortlessly sync Notion pages for seamless collaboration.",
  },
  {
    name: "Figma",
    logo: <IconBrandFigma />,
    connected: true,
    desc: "View and collaborate on Figma designs in one place.",
  },
  {
    name: "Trello",
    logo: <IconBrandTrello />,
    connected: false,
    desc: "Sync Trello cards for streamlined project management.",
  },
  {
    name: "Slack",
    logo: <IconBrandSlack />,
    connected: false,
    desc: "Integrate Slack for efficient team communication",
  },
  {
    name: "Zoom",
    logo: <IconBrandZoom />,
    connected: true,
    desc: "Host Zoom meetings directly from the dashboard.",
  },
  {
    name: "Stripe",
    logo: <IconBrandStripe />,
    connected: false,
    desc: "Easily manage Stripe transactions and payments.",
  },
  {
    name: "Gmail",
    logo: <IconBrandGmail />,
    connected: true,
    desc: "Access and manage Gmail messages effortlessly.",
  },
  {
    name: "Medium",
    logo: <IconBrandMedium />,
    connected: false,
    desc: "Explore and share Medium stories on your dashboard.",
  },
  {
    name: "Skype",
    logo: <IconBrandSkype />,
    connected: false,
    desc: "Connect with Skype contacts seamlessly.",
  },
  {
    name: "Docker",
    logo: <IconBrandDocker />,
    connected: false,
    desc: "Effortlessly manage Docker containers on your dashboard.",
  },
  {
    name: "GitHub",
    logo: <IconBrandGithub />,
    connected: false,
    desc: "Streamline code management with GitHub integration.",
  },
  {
    name: "GitLab",
    logo: <IconBrandGitlab />,
    connected: false,
    desc: "Efficiently manage code projects with GitLab integration.",
  },
  {
    name: "Discord",
    logo: <IconBrandDiscord />,
    connected: false,
    desc: "Connect with Discord for seamless team communication.",
  },
  {
    name: "WhatsApp",
    logo: <IconBrandWhatsapp />,
    connected: false,
    desc: "Easily integrate WhatsApp for direct messaging.",
  },
];
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const appText = new Map<string, string>([
  ["all", "All Apps"],
  ["connected", "Connected"],
  ["notConnected", "Not Connected"],
]);

export default function SettingAccounts() {
  const [sort, setSort] = useState("ascending");
  const [appType, setAppType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApps = apps
    .sort((a, b) =>
      sort === "ascending"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((app) =>
      appType === "connected"
        ? app.connected
        : appType === "notConnected"
        ? !app.connected
        : true
    )
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      {/* ===== Top Heading ===== */}
      {/* <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header> */}

      {/* ===== Content ===== */}
      <div className="peer-[.header-fixed]/header:mt-16 fixed-main flex grow flex-col">
        <div className="px-4 pt-6">
          <h1 className="text-2xl font-bold tracking-tight">
            App Integrations
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s a list of your apps for the integration!
          </p>
        </div>
        <div className="px-4 my-4 flex items-end justify-between sm:my-0 sm:items-center">
          <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
            <Input
              placeholder="Filter apps..."
              className="h-9 w-40 lg:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={appType} onValueChange={setAppType}>
              <SelectTrigger className="w-36">
                <SelectValue>{appText.get(appType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Apps</SelectItem>
                <SelectItem value="connected">Connected</SelectItem>
                <SelectItem value="notConnected">Not Connected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-16">
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ascending">
                <div className="flex items-center gap-4">
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value="descending">
                <div className="flex items-center gap-4">
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className="shadow-sm " />
        <ul className="px-4 py-6 overflow-y-auto max-h-[calc(100vh-14rem)] faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <li
              key={app.name}
              className="rounded-lg border p-4 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <div
                  className={`bg-muted flex size-10 items-center justify-center rounded-lg p-2`}
                >
                  {app.logo}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${
                    app.connected
                      ? "border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900"
                      : ""
                  }`}
                >
                  {app.connected ? "Connected" : "Connect"}
                </Button>
              </div>
              <div>
                <h2 className="mb-1 font-semibold">{app.name}</h2>
                <p className="line-clamp-2 text-gray-500">{app.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
