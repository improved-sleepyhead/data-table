import { Button } from "./custom-uikit/button"

export const Header = () => {
  return (
    <header className="flex h-18 w-full items-center justify-between border-b border-neutral-300 p-5 shadow-sm">
      <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
      <div className="flex items-center gap-x-3">
        <a
          href="https://github.com/improved-sleepyhead/data-table"
          className="bg-green-primary inline-flex h-10 cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
        >
          Check code -&gt;
        </a>
        <a href="https://github.com/improved-sleepyhead">
          <img
            src="/github.svg"
            alt="GitHub"
            className="text-green-primary stroke-green-primary h-8 w-auto"
          />
        </a>
      </div>
    </header>
  )
}
