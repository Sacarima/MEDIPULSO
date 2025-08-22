// components/loaders/AppShellSkeleton.jsx
export default function AppShellSkeleton({ sidebar = true }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#eef4fd]">
      {sidebar && (
        <aside className="hidden sm:flex sm:sticky sm:top-0 sm:h-screen sm:w-[4.5rem] shrink-0 border-r bg-white" />
      )}
      <section className="flex-1 lg:w-[70%] m-auto w-full p-4">
        <div className="space-y-4 animate-pulse">
          <div className="h-10 w-1/3 rounded bg-white/70" />
          <div className="h-48 w-full rounded bg-white" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 rounded bg-white" />
            <div className="h-32 rounded bg-white" />
          </div>
          <div className="h-24 w-full rounded bg-white" />
        </div>
      </section>
    </div>
  );
}
