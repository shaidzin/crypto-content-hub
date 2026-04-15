"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface PlatformTabProps {
  content: string;
  platformName: string;
}

export function PlatformTab({ content, platformName }: PlatformTabProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {content.length} characters
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy {platformName}
            </>
          )}
        </Button>
      </div>
      <div className="bg-secondary/50 rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed max-h-96 overflow-y-auto">
        {content}
      </div>
    </div>
  );
}
