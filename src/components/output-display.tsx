"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlatformTab } from "@/components/platform-tab";
import { PLATFORMS, type PlatformOutputs } from "@/types";
import { Hash, Briefcase, Camera, Mail, MessageCircle, Clapperboard, Play } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  twitter: Hash,
  linkedin: Briefcase,
  instagram: Camera,
  tiktok: Clapperboard,
  youtube: Play,
  mail: Mail,
  "message-circle": MessageCircle,
};

interface OutputDisplayProps {
  outputs: PlatformOutputs;
}

export function OutputDisplay({ outputs }: OutputDisplayProps) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Your Repurposed Content</h3>
      <Tabs defaultValue="twitter" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-secondary/50 p-1">
          {PLATFORMS.map((platform) => {
            const Icon = iconMap[platform.icon];
            return (
              <TabsTrigger
                key={platform.key}
                value={platform.key}
                className="flex-1 min-w-[80px] gap-1 text-xs sm:text-sm px-2"
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{platform.label}</span>
                <span className="sm:hidden">{platform.label.split("/")[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {PLATFORMS.map((platform) => (
          <TabsContent key={platform.key} value={platform.key}>
            <PlatformTab
              content={outputs[platform.key]}
              platformName={platform.label}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
