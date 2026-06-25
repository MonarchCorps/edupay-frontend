import { USE_MOCK } from '../utils/constants'
import { sleep } from '../utils/helpers'
import api from './axios'
import { mockWebhooks } from './mock'
import type { WebhookEvent, WebhookParams, PaginatedResponse } from '../types'

let _webhooks: WebhookEvent[] = [...mockWebhooks]

export async function getWebhookEvents(params: WebhookParams = {}): Promise<PaginatedResponse<WebhookEvent>> {
  if (USE_MOCK) {
    await sleep(400)
    let list = [..._webhooks]
    if (params.virtualAccountId) list = list.filter((w) => w.virtualAccountId === params.virtualAccountId)
    if (params.eventType) list = list.filter((w) => w.eventType === params.eventType)
    if (params.processed !== undefined) list = list.filter((w) => w.processed === params.processed)
    return { data: list, total: list.length }
  }
  const { data } = await api.get<PaginatedResponse<WebhookEvent>>('/webhook-events', { params })
  return data
}

export async function getWebhookEvent(id: string): Promise<WebhookEvent | null> {
  if (USE_MOCK) {
    await sleep(200)
    return _webhooks.find((w) => w.id === id) ?? null
  }
  const { data } = await api.get<WebhookEvent>(`/webhook-events/${id}`)
  return data
}

export async function replayWebhookEvent(id: string): Promise<WebhookEvent | undefined> {
  if (USE_MOCK) {
    await sleep(1200)
    _webhooks = _webhooks.map((w) =>
      w.id === id
        ? { ...w, processed: true, error: null, processedAt: new Date().toISOString() }
        : w
    )
    return _webhooks.find((w) => w.id === id)
  }
  const { data } = await api.post<WebhookEvent>(`/webhook-events/${id}/replay`)
  return data
}
