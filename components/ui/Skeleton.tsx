import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-md ${className}`}
      aria-hidden="true"
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col p-4 gap-3">
      {/* Photo skeleton */}
      <Skeleton className="w-full h-52 sm:h-56 rounded-2xl" />
      {/* 3 mini thumbnails skeleton */}
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>

      {/* Details skeleton */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40 rounded-lg" />
          <Skeleton className="h-4 w-14 rounded-lg" />
        </div>
        <Skeleton className="h-3.5 w-48 rounded-md" />

        {/* Badges skeleton */}
        <div className="flex items-center gap-1.5 pt-1">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* 4 spec boxes skeleton */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>

        {/* Pricing boxes skeleton */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>

        {/* Action buttons skeleton */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
