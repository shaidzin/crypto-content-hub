"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Hash, Briefcase, Camera, Clapperboard } from "lucide-react";

const sampleInput = `Remote work has fundamentally changed how teams collaborate. After managing distributed teams for 5 years, I've found that async communication isn't just a workaround — it's actually superior to real-time meetings for deep work. The key is building a culture of written documentation, clear expectations, and trust.`;

const sampleOutputs = {
  twitter: `1/ Remote work isn't the future — it's already here.\n\nAfter 5 years managing distributed teams, here's the truth nobody tells you about async communication:\n\nIt's not a workaround. It's actually BETTER. 🧵\n\n2/ Most teams default to meetings for everything.\n\nBut meetings interrupt deep work, favor extroverts, and leave no paper trail.\n\nAsync communication fixes all three.\n\n3/ The secret? Three pillars:\n\n→ Written documentation\n→ Clear expectations\n→ Trust\n\nGet these right and your team will outperform any office-bound company.\n\n4/ Start small: Replace your next status meeting with a shared doc.\n\nYou'll be shocked at how much more gets done.\n\nWhat's your biggest remote work challenge? 👇`,
  linkedin: `Remote work isn't a compromise — it's a competitive advantage.\n\nAfter 5 years of managing distributed teams, I've learned something counterintuitive: async communication doesn't just "work." It's actually superior to real-time meetings for deep, focused work.\n\nHere's why:\n\nMeetings interrupt flow states. A 30-minute meeting doesn't cost 30 minutes — it costs the 2 hours of focus time around it.\n\nAsync communication, done right, eliminates this entirely.\n\nThe three pillars that make it work:\n\n1. Written documentation — if it's not written down, it doesn't exist\n2. Clear expectations — everyone knows what's expected and by when\n3. Trust — hire adults and treat them like adults\n\nThe companies that figure this out will attract the best talent regardless of geography.\n\n#RemoteWork #AsyncCommunication #FutureOfWork #Leadership`,
  instagram: `The secret to high-performing remote teams? 🏠💻\n\nIt's NOT more Zoom calls.\n\nAfter 5 years managing distributed teams, here's what actually works:\n\n✍️ Write everything down\n📋 Set crystal-clear expectations\n🤝 Build trust, not surveillance\n\nAsync communication isn't a workaround — it's a superpower that lets your team do their best deep work.\n\nThe result? More productivity, happier people, and zero "this meeting could have been an email" moments 😅\n\nDrop a 🙋 if you've experienced this!\n\n#remotework #asyncwork #futureofwork #remoteteam #workfromhome #digitalworkplace #teammanagement #leadership #productivity #deepwork`,
  tiktok: `[HOOK] Stop having meetings about meetings.\n\n[PAUSE]\n\nAfter 5 years managing remote teams, here's what I've learned:\n\nAsync communication isn't a workaround.\n\nIt's actually BETTER than real-time meetings.\n\n[PAUSE]\n\nThree things you need:\n\nOne — write everything down. If it's not documented, it doesn't exist.\n\nTwo — set clear expectations. Everyone should know what's due and when.\n\nThree — trust your team. Hire adults, treat them like adults.\n\n[PAUSE]\n\nThe result? Deep work gets done. People are happier. And nobody says "this meeting could've been an email" ever again.\n\nWhat's your hot take on remote work? Comment below.`,
};

const tabs = [
  { key: "twitter", label: "Twitter/X", icon: Hash },
  { key: "linkedin", label: "LinkedIn", icon: Briefcase },
  { key: "instagram", label: "Instagram", icon: Camera },
  { key: "tiktok", label: "TikTok", icon: Clapperboard },
];

export function DemoSection() {
  const [activeTab, setActiveTab] = useState("twitter");

  return (
    <section id="demo" className="py-20 border-t border-border/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          See It In Action
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          One paragraph in, 7 platform-ready posts out. Here&apos;s a real example.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-start">
          {/* Input side */}
          <div>
            <Badge variant="outline" className="mb-3">Input</Badge>
            <Card className="bg-secondary/30 border-border/50">
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {sampleInput}
                </p>
                <div className="mt-3 text-xs text-muted-foreground">
                  {sampleInput.length} characters
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Arrow (desktop) */}
          <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <ArrowRight className="w-6 h-6 text-primary" />
          </div>

          {/* Output side */}
          <div>
            <Badge className="mb-3">Output</Badge>
            <Card className="border-primary/30 bg-card/50">
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full flex h-auto gap-1 bg-secondary/50 p-1 mb-4">
                    {tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.key}
                        value={tab.key}
                        className="flex-1 gap-1 text-xs px-2"
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {tabs.map((tab) => (
                    <TabsContent key={tab.key} value={tab.key}>
                      <div className="bg-secondary/30 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                        {sampleOutputs[tab.key as keyof typeof sampleOutputs]}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
