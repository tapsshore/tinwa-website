type Step = { n: string; title: string; body: string }

export function ProcessSteps({ steps }: { steps: readonly Step[] }) {
  return (
    <ol className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step) => (
        <li key={step.n} className="flex flex-col gap-3 bg-surface p-6">
          <span className="label-mono w-fit bg-accent px-1.5 py-0.5 text-[#0b0b0c]">{step.n}</span>
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
            {step.title}
          </h3>
          <p className="text-sm leading-[1.6] text-muted">{step.body}</p>
        </li>
      ))}
    </ol>
  )
}
