type SkillGroup = { title: string; items: readonly string[] }

export function SkillsGrid({ groups }: { groups: readonly SkillGroup[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <li key={group.title} className="flex flex-col gap-3 border border-border bg-surface p-6">
          <h3 className="label-mono text-muted">{group.title}</h3>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li key={item} className="border border-border px-2 py-1 text-xs text-ink">
                {item}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
