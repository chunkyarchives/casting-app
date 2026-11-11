type Props = {
  id: string
  title: string
  as?: 'h1' | 'h2'
}

export function SectionHeader({ id, title, as: Heading = 'h2' }: Props) {
  return (
    <header className="mb-6 border-b pb-2">
      <Heading id={id} className="text-xl font-semibold">
        {title}
      </Heading>
    </header>
  )
}