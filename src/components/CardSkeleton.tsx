export default function CardSkeleton() {
  return (
    <div className="flex flex-col shadow-md rounded-lg border border-(--border) bg-(--surface) animate-pulse">
      <div className="h-40 bg-(--surface-darker) rounded-t-lg w-full"></div>
      <div className="p-4">
        <div className="h-5 bg-(--surface-darker) rounded w-full mb-3"></div>
        <div className="h-5 bg-(--surface-darker) rounded w-full mb-3"></div>
        <div className="h-5 bg-(--surface-darker) rounded w-16"></div>
      </div>
    </div>
  );
}
