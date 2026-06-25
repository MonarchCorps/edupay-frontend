import { useCallback, useState } from 'react'

export function useCopyToClipboard(resetMs = 2000): { copy: (text: string) => Promise<void>; copied: boolean } {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string): Promise<void> => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), resetMs)
      } catch {
        setCopied(false)
      }
    },
    [resetMs]
  )

  return { copy, copied }
}
