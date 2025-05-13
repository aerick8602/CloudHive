"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronDown,
  // IconBrowserCheck,
  // IconNotification,
  // IconPalette,
  // IconTool,
  // IconUser,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import * as SelectPrimitive from "@radix-ui/react-select";

import {
  IconBrowserCheck,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from "@tabler/icons-react";

const sidebarNavItems = [
  {
    title: "Profile",
    icon: <IconUser size={18} />,
    href: "/settings",
  },
  {
    title: "Account",
    icon: <IconTool size={18} />,
    href: "/settings/account",
  },
  {
    title: "Appearance",
    icon: <IconPalette size={18} />,
    href: "/settings/appearance",
  },
  {
    title: "Notifications",
    icon: <IconNotification size={18} />,
    href: "/settings/notifications",
  },
  {
    title: "Display",
    icon: <IconBrowserCheck size={18} />,
    href: "/settings/display",
  },
];

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please select a valid email.",
  }),
  bio: z.string().optional(),
});

export default function SettingAccounts() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Submitted data:", data);
  };

  return (
    <>
      {/* <Header>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header> */}

      <div>
        <div className="space-y-0.5 px-4 py-6">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="shadow-sm " />
        <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="top-0 lg:sticky lg:w-1/5">
            {/* <SidebarNav items={sidebarNavItems} /> */}
          </aside>
          <div className="overflow-y-auto py-6 max-h-[calc(100vh-12rem)] flex w-full overflow-y-auto px-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full"
              >
                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name. It can be your real
                        name or a pseudonym. You can only change this once every
                        30 days.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <SelectPrimitive.Root
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectPrimitive.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded">
                            <SelectPrimitive.Value placeholder="Select a verified email to display" />
                            <SelectPrimitive.Icon>
                              <ChevronDown className="w-4 h-4" />
                            </SelectPrimitive.Icon>
                          </SelectPrimitive.Trigger>
                        </FormControl>
                        <SelectPrimitive.Portal>
                          <SelectPrimitive.Content className="bg-white border shadow">
                            <SelectPrimitive.Item
                              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                              value="user@example.com"
                            >
                              user@example.com
                            </SelectPrimitive.Item>
                            <SelectPrimitive.Item
                              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                              value="other@example.com"
                            >
                              other@example.com
                            </SelectPrimitive.Item>
                          </SelectPrimitive.Content>
                        </SelectPrimitive.Portal>
                      </SelectPrimitive.Root>
                      <FormDescription>
                        You can manage verified email addresses in your{" "}
                        <Link href="/" className="underline">
                          email settings
                        </Link>
                        .
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tell us a little about yourself"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button type="submit">Update profile</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
