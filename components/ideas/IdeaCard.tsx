"use client";

import Link from "next/link";
import {
  ThumbsUp,
  ThumbsDown,
  Eye,
  Bookmark,
  BookmarkCheck,
  BadgeDollarSign,
  Star,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Idea } from "@/types/types";
import {
  cn,
  formatNumber,
  formatRelativeTime,
  ideaStatusLabel,
  ideaStatusVariant,
} from "@/lib/utils";

interface IdeaCardProps {
  idea: Idea;
  showStatus?: boolean;
}

export default function IdeaCard({ idea, showStatus = false }: IdeaCardProps) {
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [watchlisted, setWatchlisted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(idea.upvoteCount);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (upvoted) {
      setUpvoted(false);
      setUpvoteCount((c) => c - 1);
    } else {
      setUpvoted(true);
      if (downvoted) setDownvoted(false);
      setUpvoteCount((c) => c + 1);
    }
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (downvoted) {
      setDownvoted(false);
    } else {
      setDownvoted(true);
      if (upvoted) {
        setUpvoted(false);
        setUpvoteCount((c) => c - 1);
      }
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Cover Image */}
      {idea.images[0] && (
        <Link
          href={`/ideas/${idea.id}`}
          className="relative block h-44 shrink-0 overflow-hidden bg-muted"
        >
          <img
            src={idea.images[0]}
            alt={idea.title}
            className="h-full w-full object-cover"
          />
          {idea.isFeatured && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white shadow">
              <Star className="size-3 fill-white" /> Featured
            </div>
          )}
          {idea.isPaid && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold shadow backdrop-blur-sm">
              <BadgeDollarSign className="size-3 text-accent" />${idea.price}
            </div>
          )}
        </Link>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {idea.categories?.slice(0, 2).map((cat) => (
            <Badge
              key={cat.category?.id}
              variant="secondary"
              className="text-[10px] px-2 py-0 font-medium"
            >
              {cat.category?.name}
            </Badge>
          ))}
          {showStatus && (
            <Badge
              variant={ideaStatusVariant(idea.status)}
              className="ml-auto text-[10px] px-2 py-0"
            >
              {ideaStatusLabel(idea.status)}
            </Badge>
          )}
        </div>

        {/* Title */}
        <Link href={`/ideas/${idea.id}`}>
          <h3 className="text-sm font-semibold leading-snug text-foreground line-clamp-2 hover:text-primary mb-2">
            {idea.title}
          </h3>
        </Link>

        {/* Description */}
        <div className="relative line-clamp-2 flex-1 mb-4">
          <p className={cn(
            "text-[13px] leading-relaxed",
            idea.isPaid ? "text-muted-foreground/50 blur-[3px] select-none" : "text-muted-foreground"
          )}>
            {idea.description || idea.problemStatement}
          </p>
          {idea.isPaid && (
             <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[1px]">
               <div className="flex bg-background/80 rounded-full px-2 py-1 items-center gap-1.5 shadow-sm border border-border/50">
                 <Lock className="size-3 text-primary" />
                 <span className="text-[10px] font-medium text-foreground">Paid Content</span>
               </div>
             </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between mb-2.5">
            <Link
              href={`/profile/${idea.author.id}`}
              className="flex items-center gap-2"
            >
              <Avatar className="size-6">
                <AvatarImage src={idea.author.image} alt={idea.author.name} />
                <AvatarFallback className="text-[10px]">
                  {idea.author.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-[12px] font-medium text-foreground">
                {idea.author.name}
              </span>
            </Link>
            <span className="text-[11px] text-muted-foreground">
              {formatRelativeTime(idea.createdAt)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger>
                <button
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium",
                    upvoted
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                // onClick={handleUpvote}
                >
                  <ThumbsUp className="size-3.5" />
                  {formatNumber(upvoteCount)}
                </button>
              </TooltipTrigger>
              <TooltipContent>Upvote</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <button
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium",
                    downvoted
                      ? "bg-destructive/10 text-destructive"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                // onClick={handleDownvote}
                >
                  <ThumbsDown className="size-3.5" />
                  {formatNumber(idea.downvoteCount)}
                </button>
              </TooltipTrigger>
              <TooltipContent>Downvote</TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-1 px-2 py-1 text-[12px] text-muted-foreground">
              <Eye className="size-3.5" />
              {formatNumber(idea.viewCount)}
            </div>

            <Tooltip>
              <TooltipTrigger>
                <button
                  className={cn(
                    "ml-auto flex items-center justify-center rounded-md p-1.5",
                    watchlisted
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                // onClick={(e) => {
                //   e.preventDefault();
                //   setWatchlisted((w) => !w);
                // }}
                >
                  {watchlisted ? (
                    <>
                      <BookmarkCheck className="size-3.5" />
                      {idea?._count?.watchlistCount && formatNumber(idea?._count?.watchlistCount || 0)}
                    </>
                  ) : (
                    <>
                      <Bookmark className="size-3.5" />
                      {idea?._count?.watchlistCount && formatNumber(idea?._count?.watchlistCount || 0)}
                    </>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {watchlisted ? "Remove from watchlist" : "Add to watchlist"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
