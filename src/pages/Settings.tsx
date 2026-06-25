import { useState } from 'react'
import {
  Card, Button, Title, Text, List, ListItem, Flex,
} from '@tremor/react'
import { Key, Trash2, Plus } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { useApiKeys, useGenerateApiKey, useRevokeApiKey } from '../hooks/useApiKeys'
import { maskApiKey, formatDateTime } from '../utils/formatters'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import type { ApiKey } from '../types'

interface NewKeyModalProps {
  apiKey: string | null
  onClose: () => void
}

function NewKeyModal({ apiKey, onClose }: NewKeyModalProps) {
  const { copy, copied } = useCopyToClipboard()
  return (
    <Modal isOpen={!!apiKey} onClose={onClose} title="Your New API Key" size="md">
      <div className="space-y-4">
        <div className="bg-accent-light border border-accent/30 rounded-tremor-small p-3">
          <p className="font-mono text-sm break-all text-gray-900 font-medium">{apiKey}</p>
        </div>
        <div className="flex justify-between items-center">
          <Text className="text-red-600 text-sm font-medium">
            ⚠ This key will not be shown again. Copy it now.
          </Text>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => apiKey && copy(apiKey)}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

interface RowProps {
  label: string
  value: string
  mono?: boolean
}

function Row({ label, value, mono }: RowProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className={mono ? 'font-mono text-xs text-gray-700' : 'text-gray-900'}>{value}</span>
    </div>
  )
}

export default function Settings() {
  const { data: keys = [], isLoading } = useApiKeys()
  const generate = useGenerateApiKey()
  const revoke = useRevokeApiKey()
  const [newKey, setNewKey] = useState<string | null>(null)
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null)

  const handleGenerate = async () => {
    const result = await generate.mutateAsync()
    setNewKey(result.key)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your API keys and account information" />

      <Card>
        <Flex className="mb-4">
          <Title>API Keys</Title>
          <Button
            size="sm"
            icon={Plus}
            loading={generate.isPending}
            onClick={handleGenerate}
            className="bg-accent hover:bg-accent/90 text-gray-900 border-accent font-semibold"
          >
            Generate New Key
          </Button>
        </Flex>

        {isLoading ? (
          <div className="space-y-2">
            {[1,2].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : keys.length === 0 ? (
          <EmptyState
            icon={Key}
            title="No API keys yet"
            description="Generate your first API key to start making requests."
          />
        ) : (
          <List>
            {keys.map((k) => (
              <ListItem key={k.id}>
                <div className="flex-1 min-w-0">
                  <code className="font-mono text-sm text-gray-900">{maskApiKey(k.key)}</code>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Created {formatDateTime(k.createdAt)}
                  </p>
                </div>
                <Button
                  size="xs"
                  variant="secondary"
                  color="red"
                  icon={Trash2}
                  onClick={() => setRevokeTarget(k)}
                  aria-label="Revoke API key"
                >
                  Revoke
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Card>

      <Card>
        <Title className="mb-4">Account Info</Title>
        <div className="space-y-3 text-sm">
          <Row label="Merchant Name" value="EduPay Infrastructure" />
          <Row label="Account ID" value="merchant_edupay_2026" mono />
          <Row label="Created" value="1 Jan 2026" />
          <Row label="Plan" value="Developer (Sandbox)" />
        </div>
      </Card>

      <NewKeyModal apiKey={newKey} onClose={() => setNewKey(null)} />

      <Modal
        isOpen={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        title="Revoke API Key"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRevokeTarget(null)}>Cancel</Button>
            <Button
              color="red"
              loading={revoke.isPending}
              onClick={async () => {
                if (revokeTarget) await revoke.mutateAsync(revokeTarget.id)
                setRevokeTarget(null)
              }}
            >
              Revoke Key
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Revoking <code className="font-mono">{maskApiKey(revokeTarget?.key)}</code> will immediately
          invalidate any requests using this key.
        </p>
      </Modal>
    </div>
  )
}
