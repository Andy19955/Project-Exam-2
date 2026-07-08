export default function ProfileHeaderSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-5 sm:py-10">
      <div className="overflow-hidden rounded-4xl border border-(--border) bg-(--surface) shadow-lg animate-pulse">
        <div className="relative h-56 bg-(--surface-darker) sm:h-72">
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-(--surface)" />
        </div>
        <div className="relative px-6 pb-8 sm:px-10 sm:pb-10">
          <div className="-mt-16 flex flex-col gap-6 lg:-mt-20 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:items-end lg:text-left">
              <div className="h-32 w-32 rounded-full border-4 border-(--surface) bg-(--surface-darker) shadow-lg lg:h-36 lg:w-36" />
              <div className="max-w-2xl flex flex-col gap-3 pb-1">
                <div className="h-8 w-24 rounded-full bg-(--surface-darker)" />
                <div className="flex flex-col gap-2">
                  <div className="h-8 w-56 rounded bg-(--surface-darker) sm:h-10 sm:w-72" />
                  <div className="h-5 w-64 rounded bg-(--surface-darker)" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full max-w-2xl rounded bg-(--surface-darker)" />
                  <div className="h-4 w-5/6 rounded bg-(--surface-darker)" />
                </div>
              </div>
            </div>
            <div className="h-11 w-36 rounded-full bg-(--surface-darker)" />
          </div>
        </div>
      </div>
    </section>
  );
}