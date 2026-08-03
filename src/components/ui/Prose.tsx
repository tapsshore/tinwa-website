export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-2xl flex-col gap-6 text-base leading-[1.65] text-muted [&_a]:text-ink [&_a]:underline [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
      {children}
    </div>
  )
}
