import { ProfileAvatar } from '@/components/common/media/ProfileAvatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Crew } from '@/types/crew'

type Person = {
  id: string
  name: string
  director: boolean
}

type Props = {
  crew: Crew
  viewerId: string | undefined
  headingLevel?: 2 | 3
  emptyHint?: string
}

export function CrewMembers({ crew, viewerId, headingLevel = 2, emptyHint }: Props) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2'
  const people: Person[] = [
    { id: crew.director.id, name: `${crew.director.firstName} ${crew.director.lastName}`, director: true },
    ...crew.members.map((member) => ({
      id: member.castingDirectorId,
      name: `${member.firstName} ${member.lastName}`,
      director: false,
    })),
  ]

  return (
    <section className="flex flex-col gap-3">
      <Heading className="font-semibold">Members</Heading>
      <Separator />

      <ul className="flex flex-wrap gap-3">
        {people.map((person) => (
          <li key={person.id} className="flex min-w-0 items-center gap-3 rounded-2xl border bg-card py-2 pr-4 pl-2">
            <ProfileAvatar participantId={person.id} className="size-10 shrink-0" />
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium">
                {person.name}
                {person.id === viewerId && <span className="font-normal text-muted-foreground"> (you)</span>}
              </span>
              {person.director ? (
                <Badge className="mt-0.5">Director</Badge>
              ) : (
                <span className="text-xs text-muted-foreground">Casting director</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {crew.members.length === 0 && emptyHint && <p className="text-center text-sm text-muted-foreground">{emptyHint}</p>}
    </section>
  )
}