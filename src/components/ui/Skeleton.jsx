function Pulse({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 flex items-center gap-4">
      <Pulse className="w-11 h-11 rounded-xl shrink-0" />
      <div className="space-y-2 flex-1">
        <Pulse className="h-3 w-20" />
        <Pulse className="h-6 w-28" />
      </div>
    </div>
  );
}

export function SkeletonDeliveryCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Pulse className="h-3 w-14" />
          <Pulse className="h-5 w-24" />
        </div>
        <Pulse className="h-6 w-20 rounded-full" />
      </div>
      <Pulse className="h-2 w-full rounded-full" />
      <div className="flex justify-between">
        <Pulse className="h-4 w-24" />
        <Pulse className="h-4 w-24" />
        <Pulse className="h-4 w-24" />
      </div>
    </div>
  );
}

export function SkeletonPartnerSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Pulse className="h-5 w-32" />
          <Pulse className="h-3 w-56" />
        </div>
        <Pulse className="h-9 w-28" />
      </div>
    </div>
  );
}
