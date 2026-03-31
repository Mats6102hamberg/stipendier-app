export default function SkeletonKort() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
        <div className="h-6 w-20 bg-blue-100 rounded-full shrink-0" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-14 bg-gray-100 rounded-full" />
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
        <div className="h-5 w-12 bg-gray-100 rounded-full" />
      </div>
      <div className="flex justify-between pt-2 border-t border-gray-50">
        <div className="h-3 w-32 bg-gray-100 rounded" />
        <div className="h-3 w-12 bg-blue-100 rounded" />
      </div>
    </div>
  );
}
