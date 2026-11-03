import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockLine,
} from '@/components/ui/code-block'
import { useHighlightedCode } from '@/hooks/use-highlighted-code'
import type { AuditEntry } from '@/types/admin'

export function AuditEntryDetails({ entry }: { entry: AuditEntry }) {
  const json = JSON.stringify(entry, null, 2)
  const lines = useHighlightedCode(json, 'json')

  return (
    <div className="px-3 pt-1 pb-3">
      <CodeBlock size="sm">
        <CodeBlockActions>
          <CodeBlockCopyButton value={json} />
        </CodeBlockActions>
        <CodeBlockContent lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}