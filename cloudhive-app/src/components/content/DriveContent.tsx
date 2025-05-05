"use client";
import useSWR from "swr";
import { useMemo, useEffect } from "react";
import { DriveCard } from "../drive-card";
import { AccountProps } from "@/types/AccountProps";
import { swrConfig } from "@/hooks/use-swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DriveContent({ accounts }: { accounts: AccountProps[] }) {
  // Fetch files for each account
  const swrResponses = accounts.map((account) => {
    const url = `/api/file/${account.e}?parentId=root&trashed=false`;
    // return useSWR(url, fetcher, swrConfig);
    return useSWR(url, fetcher);
  });

  // Check if any response is still loading or has an error
  const allLoading = swrResponses.some((res) => res.isLoading);
  const anyError = swrResponses.find((res) => res.error);

  // Merge all files from all accounts
  const allFiles = useMemo(() => {
    return swrResponses.flatMap((res) => res.data?.files || []);
  }, [swrResponses]);

  // const allFiles: any = [];
  // const dummyFiles = [
  //   {
  //     id: "12Bo5cH9jmhJnBFUaUrdG41vVj8IMfV3B",
  //     email: "maverick8602@gmail.com",
  //     name: "0328 Dub, Edited.mp4",
  //     mimeType: "video/mp4",
  //     parents: ["0AL7L8bHjeJkGUk9PVA"],
  //     starred: false,
  //     trashed: false,
  //     createdTime: "2024-12-05T09:30:00Z",
  //     modifiedTime: "2025-01-10T14:15:00Z",
  //     permissions: [
  //       {
  //         displayName: "Ayush Katiyar",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a/ACg8ocJqSQhYlYNY4erOh2UCAcmhz8c7d-TpJ8KwV3BMl_LFNLUYnQ=s64",
  //         id: "02815059765992363055",
  //         type: "user",
  //         emailAddress: "maverick8602@gmail.com",
  //         role: "owner",
  //       },
  //       {
  //         displayName: "Ayush Katiyar",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a-/ALV-UjU3rBkRxBeWHQB68NRK1RXU_-44Z8UbAY2wglMCRxaa8rq9wmod=s64",
  //         id: "03077307409702619721",
  //         type: "user",
  //         emailAddress: "katiyarayush02@gmail.com",
  //         role: "writer",
  //       },
  //     ],
  //     quotaBytesUsed: 102400,
  //   },
  //   {
  //     id: "1gHTF-dOCRZD3_UlfDKcwgS_tUMPRtOGb",
  //     email: "maverick8602@gmail.com",
  //     name: "17462831123286042703706227348382.jpg",
  //     mimeType: "image/jpeg",
  //     parents: ["0AL7L8bHjeJkGUk9PVA"],
  //     starred: true,
  //     trashed: false,
  //     createdTime: "2025-02-01T11:00:00Z",
  //     modifiedTime: "2025-02-02T13:20:00Z",
  //     permissions: [
  //       {
  //         displayName: "Ayush Katiyar",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a/ACg8ocJqSQhYlYNY4erOh2UCAcmhz8c7d-TpJ8KwV3BMl_LFNLUYnQ=s64",
  //         id: "02815059765992363055",
  //         type: "user",
  //         emailAddress: "maverick8602@gmail.com",
  //         role: "owner",
  //       },
  //       {
  //         displayName: "Ayush Katiyar",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a-/ALV-UjU3rBkRxBeWHQB68NRK1RXU_-44Z8UbAY2wglMCRxaa8rq9wmod=s64",
  //         id: "03077307409702619721",
  //         type: "user",
  //         emailAddress: "katiyarayush02@gmail.com",
  //         role: "writer",
  //       },
  //     ],
  //     quotaBytesUsed: 204800,
  //   },
  //   {
  //     id: "1L1e8gp1UODYAYbaVD9fR9PEbuaVxN-4j",
  //     email: "maverick8602@gmail.com",
  //     name: "What is React.docx",
  //     mimeType:
  //       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //     parents: ["0AL7L8bHjeJkGUk9PVA"],
  //     starred: false,
  //     trashed: true,
  //     createdTime: "2025-01-01T08:45:00Z",
  //     modifiedTime: "2025-03-01T10:00:00Z",
  //     permissions: [
  //       {
  //         displayName: "Ayush Katiyar",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a/ACg8ocJqSQhYlYNY4erOh2UCAcmhz8c7d-TpJ8KwV3BMl_LFNLUYnQ=s64",
  //         id: "02815059765992363055",
  //         type: "user",
  //         emailAddress: "maverick8602@gmail.com",
  //         role: "owner",
  //       },
  //     ],
  //     quotaBytesUsed: 51200,
  //   },
  //   {
  //     id: "1UUSxaoNCv24Lmc3knHXDWdnDChsiSIuX",
  //     name: "Dynamic_Range_Minimum_Queries.bin",
  //     mimeType: "application/x-dosexec",
  //     parents: ["0AL7L8bHjeJkGUk9PVA"],
  //     starred: false,
  //     trashed: false,

  //     createdTime: "2025-05-03T14:33:16.537Z",
  //     modifiedTime: "2025-05-03T14:33:17.557Z",

  //     permissions: [
  //       {
  //         id: "02815059765992363055",
  //         type: "user",
  //         role: "owner",
  //         displayName: "Ayush Katiyar",
  //         emailAddress: "maverick8602@gmail.com",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a/ACg8ocJqSQhYlYNY4erOh2UCAcmhz8c7d-TpJ8KwV3BMl_LFNLUYnQ=s64",
  //       },
  //       {
  //         id: "03077307409702619721",
  //         type: "user",
  //         role: "writer",
  //         displayName: "Ayush Katiyar",
  //         emailAddress: "katiyarayush02@gmail.com",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a-/ALV-UjU3rBkRxBeWHQB68NRK1RXU_-44Z8UbAY2wglMCRxaa8rq9wmod=s64",
  //       },
  //     ],
  //     quotaBytesUsed: 165643,
  //   },
  //   {
  //     id: "12Bo5cH9jmhJnBFUaUrdG41vVj8IMfV3B",
  //     email: "maverick8602@gmail.com",
  //     name: "0328 Dub, Edited.mp4",
  //     mimeType: "video/mp4",
  //     parents: ["0AL7L8bHjeJkGUk9PVA"],
  //     starred: false,
  //     trashed: false,
  //     createdTime: "2024-12-05T09:30:00Z",
  //     modifiedTime: "2025-01-10T14:15:00Z",
  //     permissions: [
  //       {
  //         displayName: "Ayush Katiyar",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a/ACg8ocJqSQhYlYNY4erOh2UCAcmhz8c7d-TpJ8KwV3BMl_LFNLUYnQ=s64",
  //         id: "02815059765992363055",
  //         type: "user",
  //         emailAddress: "maverick8602@gmail.com",
  //         role: "owner",
  //       },
  //       {
  //         displayName: "Ayush Katiyar",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a-/ALV-UjU3rBkRxBeWHQB68NRK1RXU_-44Z8UbAY2wglMCRxaa8rq9wmod=s64",
  //         id: "03077307409702619721",
  //         type: "user",
  //         emailAddress: "katiyarayush02@gmail.com",
  //         role: "writer",
  //       },
  //     ],
  //     quotaBytesUsed: 102400,
  //   },
  //   {
  //     id: "12Bo5cH9jmhJnBFUaUrdG41vVj8IMfV3B",
  //     email: "maverick8602@gmail.com",
  //     name: "0328 Dub, Edited.mp4",
  //     mimeType: "video/mp4",
  //     parents: ["0AL7L8bHjeJkGUk9PVA"],
  //     starred: false,
  //     trashed: false,
  //     createdTime: "2024-12-05T09:30:00Z",
  //     modifiedTime: "2025-01-10T14:15:00Z",
  //     permissions: [
  //       {
  //         displayName: "Ayush Katiyar",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a/ACg8ocJqSQhYlYNY4erOh2UCAcmhz8c7d-TpJ8KwV3BMl_LFNLUYnQ=s64",
  //         id: "02815059765992363055",
  //         type: "user",
  //         emailAddress: "maverick8602@gmail.com",
  //         role: "owner",
  //       },
  //       {
  //         displayName: "Ayush Katiyar",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a-/ALV-UjU3rBkRxBeWHQB68NRK1RXU_-44Z8UbAY2wglMCRxaa8rq9wmod=s64",
  //         id: "03077307409702619721",
  //         type: "user",
  //         emailAddress: "katiyarayush02@gmail.com",
  //         role: "writer",
  //       },
  //     ],
  //     quotaBytesUsed: 102400,
  //   },
  //   {
  //     id: "12Bo5cH9jmhJnBFUaUrdG41vVj8IMfV3B",
  //     email: "maverick8602@gmail.com",
  //     name: "0328 Dub, Edited.mp4",
  //     mimeType: "video/mp4",
  //     parents: ["0AL7L8bHjeJkGUk9PVA"],
  //     starred: false,
  //     trashed: false,
  //     createdTime: "2024-12-05T09:30:00Z",
  //     modifiedTime: "2025-01-10T14:15:00Z",
  //     permissions: [
  //       {
  //         displayName: "Ayush Katiyar",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a/ACg8ocJqSQhYlYNY4erOh2UCAcmhz8c7d-TpJ8KwV3BMl_LFNLUYnQ=s64",
  //         id: "02815059765992363055",
  //         type: "user",
  //         emailAddress: "maverick8602@gmail.com",
  //         role: "owner",
  //       },
  //       {
  //         displayName: "Ayush Katiyar",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a-/ALV-UjU3rBkRxBeWHQB68NRK1RXU_-44Z8UbAY2wglMCRxaa8rq9wmod=s64",
  //         id: "03077307409702619721",
  //         type: "user",
  //         emailAddress: "katiyarayush02@gmail.com",
  //         role: "writer",
  //       },
  //     ],
  //     quotaBytesUsed: 102400,
  //   },
  //   {
  //     id: "12Bo5cH9jmhJnBFUaUrdG41vVj8IMfV3B",
  //     email: "maverick8602@gmail.com",
  //     name: "0328 Dub, Edited.mp4",
  //     mimeType: "video/mp4",
  //     parents: ["0AL7L8bHjeJkGUk9PVA"],
  //     starred: false,
  //     trashed: false,
  //     createdTime: "2024-12-05T09:30:00Z",
  //     modifiedTime: "2025-01-10T14:15:00Z",
  //     permissions: [
  //       {
  //         displayName: "Ayush Katiyar",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a/ACg8ocJqSQhYlYNY4erOh2UCAcmhz8c7d-TpJ8KwV3BMl_LFNLUYnQ=s64",
  //         id: "02815059765992363055",
  //         type: "user",
  //         emailAddress: "maverick8602@gmail.com",
  //         role: "owner",
  //       },
  //       {
  //         displayName: "Ayush Katiyar",
  //         photoLink:
  //           "https://lh3.googleusercontent.com/a-/ALV-UjU3rBkRxBeWHQB68NRK1RXU_-44Z8UbAY2wglMCRxaa8rq9wmod=s64",
  //         id: "03077307409702619721",
  //         type: "user",
  //         emailAddress: "katiyarayush02@gmail.com",
  //         role: "writer",
  //       },
  //     ],
  //     quotaBytesUsed: 102400,
  //   },
  // ];

  // Log merged files when available
  useEffect(() => {
    if (allFiles.length) {
      console.log("📁 Merged Files", allFiles);
    }
  }, [allFiles]);

  // Handle errors and loading states
  if (anyError) {
    throw new Error("Error fetching files");
  }

  // Render the component with the fetched files
  return (
    <div className="container mx-auto p-2 space-y-4">
      <DriveCard tab="My Drive" allFile={allFiles} allLoading={allLoading} />
    </div>
  );
}
