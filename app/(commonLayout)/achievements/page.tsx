import { Trophy, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockAchievements } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const achievementEmojis: Record<string, string> = {
  Lightbulb: "💡",
  TrendingUp: "📈",
  Users: "👥",
  Award: "🏆",
  Star: "⭐",
  Crown: "👑",
  Eye: "👁️",
  MessageSquare: "💬",
};

export default function AchievementsPage() {
  const earned = mockAchievements.filter((a) => !a.isLocked);
  const locked = mockAchievements.filter((a) => a.isLocked);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-heading font-bold flex items-center gap-2">
            <Trophy className="size-5 text-primary" />
            Achievements
          </h1>
          <p className="text-caption mt-0.5">
            {earned.length} of {mockAchievements.length} earned
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 rounded-xl border bg-card p-4">
          <div className="mb-2 flex justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-caption">
              {earned.length}/{mockAchievements.length}
            </span>
          </div>
          <Progress
            value={(earned.length / mockAchievements.length) * 100}
            className="h-2"
          />
        </div>

        {/* Earned */}
        <section className="mb-8">
          <h2 className="text-subheading mb-4 font-semibold">
            Earned ({earned.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {earned.map((ach) => (
              <Card
                key={ach.id}
                className="border-primary/20 bg-primary/5 transition-shadow hover:shadow-md"
              >
                <CardContent className="flex flex-col items-center gap-3 pt-6 pb-5 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                    {achievementEmojis[ach.icon ?? ""] ?? "🎖️"}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{ach.name}</p>
                    <p className="text-caption mt-0.5">{ach.description}</p>
                  </div>
                  {ach.earnedAt && (
                    <Badge
                      variant="outline"
                      className="text-label text-primary border-primary/30"
                    >
                      Earned {formatDate(ach.earnedAt)}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Locked */}
        <section>
          <h2 className="text-subheading mb-4 font-semibold text-muted-foreground">
            Locked ({locked.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {locked.map((ach) => (
              <Card key={ach.id} className="opacity-60 grayscale">
                <CardContent className="flex flex-col items-center gap-3 pt-6 pb-5 text-center">
                  <div className="relative flex size-14 items-center justify-center rounded-full bg-muted text-2xl">
                    <span className="opacity-30">
                      {achievementEmojis[ach.icon ?? ""] ?? "🎖️"}
                    </span>
                    <Lock className="absolute bottom-0 right-0 size-4 rounded-full bg-muted-foreground p-0.5 text-background" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">
                      {ach.name}
                    </p>
                    <p className="text-caption mt-0.5">{ach.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
