"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, RotateCcw } from "lucide-react";

interface PlatformTabProps {
  content: string;
  platformName: string;
}

export function PlatformTab({ content }: PlatformTabProps) {
  const [copied, setCopied] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const isEdited = editedContent !== content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setEditedContent(content);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {editedContent.length} characters
          {isEdited && (
            <span className="text-yellow-400 ml-2">(edited)</span>
          )}
        </span>
        <div className="flex gap-2">
          {isEdited && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-muted-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          )}
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
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="w-full bg-secondary/50 rounded-lg p-4 text-sm leading-relaxed min-h-[200px] resize-y border-0 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
        spellCheck={false}
      />
    </div>
  );
}
