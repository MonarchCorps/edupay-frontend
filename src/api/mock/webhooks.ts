import type { WebhookEvent } from '../../types'

function makePayload(type: string, accountId: string, amount: number, senderName: string): unknown {
  return {
    event: type,
    data: {
      virtualAccountId: accountId,
      amount,
      currency: 'NGN',
      senderName,
      senderBank: 'Zenith Bank',
      narration: 'Payment for services',
      nombaRef: `NMB-WH-${Date.now()}`,
      timestamp: new Date().toISOString(),
    },
    meta: { version: '1.0', environment: 'sandbox' },
  }
}

export const mockWebhooks: WebhookEvent[] = [
  { id: 'wh_001', eventType: 'transfer.credit',    virtualAccountId: 'acc_001', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_001', 50_000_00,    'Zenith Bank PLC'),      receivedAt: '2026-06-23T08:01:00.000Z', processedAt: '2026-06-23T08:01:02.000Z' },
  { id: 'wh_002', eventType: 'transfer.credit',    virtualAccountId: 'acc_002', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_002', 25_000_00,    'Taiwo Olawale'),         receivedAt: '2026-06-23T07:46:00.000Z', processedAt: '2026-06-23T07:46:01.000Z' },
  { id: 'wh_003', eventType: 'transfer.credit',    virtualAccountId: 'acc_003', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_003', 100_000_00,   'Stanbic IBTC'),          receivedAt: '2026-06-23T07:31:00.000Z', processedAt: '2026-06-23T07:31:03.000Z' },
  { id: 'wh_004', eventType: 'transfer.debit',     virtualAccountId: 'acc_001', processed: true,  error: null, rawPayload: makePayload('transfer.debit',    'acc_001', 10_000_00,    'Chukwuemeka Okafor'),    receivedAt: '2026-06-23T07:01:00.000Z', processedAt: '2026-06-23T07:01:01.000Z' },
  { id: 'wh_005', eventType: 'transfer.credit',    virtualAccountId: 'acc_004', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_004', 5_000_00,     'Kola Adesanya'),          receivedAt: '2026-06-22T22:01:00.000Z', processedAt: '2026-06-22T22:01:04.000Z' },
  { id: 'wh_006', eventType: 'transfer.credit',    virtualAccountId: 'acc_005', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_005', 75_000_00,    'Olusegun Martins'),       receivedAt: '2026-06-22T21:01:00.000Z', processedAt: '2026-06-22T21:01:02.000Z' },
  { id: 'wh_007', eventType: 'transfer.credit',    virtualAccountId: 'acc_006', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_006', 200_000_00,   'Lagos Steel Ltd'),        receivedAt: '2026-06-22T19:01:00.000Z', processedAt: '2026-06-22T19:01:05.000Z' },
  { id: 'wh_008', eventType: 'transfer.credit',    virtualAccountId: 'acc_007', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_007', 30_000_00,    'Ngozi Eze'),              receivedAt: '2026-06-22T18:01:00.000Z', processedAt: '2026-06-22T18:01:02.000Z' },
  { id: 'wh_009', eventType: 'account.frozen',     virtualAccountId: 'acc_015', processed: true,  error: null, rawPayload: { event: 'account.frozen', data: { virtualAccountId: 'acc_015', reason: 'Suspicious activity detected', frozenAt: '2026-05-10T09:00:00Z' }, meta: { version: '1.0' } }, receivedAt: '2026-05-10T09:01:00.000Z', processedAt: '2026-05-10T09:01:03.000Z' },
  { id: 'wh_010', eventType: 'account.frozen',     virtualAccountId: 'acc_016', processed: true,  error: null, rawPayload: { event: 'account.frozen', data: { virtualAccountId: 'acc_016', reason: 'KYC documents expired', frozenAt: '2026-04-01T11:00:00Z' }, meta: { version: '1.0' } }, receivedAt: '2026-04-01T11:01:00.000Z', processedAt: '2026-04-01T11:01:02.000Z' },
  { id: 'wh_011', eventType: 'transfer.credit',    virtualAccountId: 'acc_009', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_009', 500_000_00,   'Abuja Properties Ltd'),   receivedAt: '2026-06-22T16:01:00.000Z', processedAt: '2026-06-22T16:01:04.000Z' },
  { id: 'wh_012', eventType: 'transfer.credit',    virtualAccountId: 'acc_010', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_010', 45_000_00,    'Emeka Nwachukwu'),        receivedAt: '2026-06-22T15:01:00.000Z', processedAt: '2026-06-22T15:01:01.000Z' },
  { id: 'wh_013', eventType: 'account.kyc_update', virtualAccountId: 'acc_008', processed: true,  error: null, rawPayload: { event: 'account.kyc_update', data: { virtualAccountId: 'acc_008', previousTier: 'tier1', newTier: 'tier1', updatedAt: '2026-03-10T09:00:00Z' }, meta: { version: '1.0' } }, receivedAt: '2026-03-10T09:01:00.000Z', processedAt: '2026-03-10T09:01:02.000Z' },
  { id: 'wh_014', eventType: 'transfer.credit',    virtualAccountId: 'acc_012', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_012', 1_000_000_00, 'Dangote Industries'),     receivedAt: '2026-06-22T13:01:00.000Z', processedAt: '2026-06-22T13:01:06.000Z' },
  { id: 'wh_015', eventType: 'transfer.debit',     virtualAccountId: 'acc_003', processed: true,  error: null, rawPayload: makePayload('transfer.debit',    'acc_003', 50_000_00,    'Tunde Fashola'),          receivedAt: '2026-06-22T12:01:00.000Z', processedAt: '2026-06-22T12:01:01.000Z' },
  { id: 'wh_016', eventType: 'transfer.credit',    virtualAccountId: 'acc_006', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_006', 150_000_00,   'Kano Textile Mills'),     receivedAt: '2026-06-22T10:01:00.000Z', processedAt: '2026-06-22T10:01:03.000Z' },
  { id: 'wh_017', eventType: 'transfer.credit',    virtualAccountId: 'acc_009', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_009', 200_000_00,   'Port Harcourt Traders'),  receivedAt: '2026-06-22T09:01:00.000Z', processedAt: '2026-06-22T09:01:02.000Z' },
  { id: 'wh_018', eventType: 'transfer.credit',    virtualAccountId: 'acc_001', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_001', 80_000_00,    'Femi Olatunde'),          receivedAt: '2026-06-22T08:01:00.000Z', processedAt: '2026-06-22T08:01:01.000Z' },
  { id: 'wh_019', eventType: 'account.closed',     virtualAccountId: 'acc_017', processed: true,  error: null, rawPayload: { event: 'account.closed', data: { virtualAccountId: 'acc_017', reason: 'Customer requested closure', closedAt: '2026-04-15T09:00:00Z' }, meta: { version: '1.0' } }, receivedAt: '2026-04-15T09:01:00.000Z', processedAt: '2026-04-15T09:01:04.000Z' },
  { id: 'wh_020', eventType: 'transfer.credit',    virtualAccountId: 'acc_011', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_011', 120_000_00,   'Sokoto Feeds Ltd'),       receivedAt: '2026-06-21T18:01:00.000Z', processedAt: '2026-06-21T18:01:02.000Z' },
  { id: 'wh_021', eventType: 'transfer.credit',    virtualAccountId: 'acc_003', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_003', 300_000_00,   'Federal Ministry of Ed'), receivedAt: '2026-06-21T17:01:00.000Z', processedAt: '2026-06-21T17:01:03.000Z' },
  { id: 'wh_022', eventType: 'transfer.credit',    virtualAccountId: 'acc_018', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_018', 400_000_00,   'Unknown Sender'),         receivedAt: '2026-06-21T16:01:00.000Z', processedAt: '2026-06-21T16:01:05.000Z' },
  { id: 'wh_023', eventType: 'transfer.credit',    virtualAccountId: 'acc_019', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_019', 750_000_00,   'Offshore Transfer'),      receivedAt: '2026-06-21T15:01:00.000Z', processedAt: '2026-06-21T15:01:04.000Z' },
  { id: 'wh_024', eventType: 'transfer.credit',    virtualAccountId: 'acc_012', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_012', 250_000_00,   'Enugu Coal Corp'),        receivedAt: '2026-06-21T21:01:00.000Z', processedAt: '2026-06-21T21:01:02.000Z' },
  { id: 'wh_025', eventType: 'transfer.credit',    virtualAccountId: 'acc_007', processed: true,  error: null, rawPayload: makePayload('transfer.credit',   'acc_007', 90_000_00,    'Rivers State Govt'),      receivedAt: '2026-06-21T20:01:00.000Z', processedAt: '2026-06-21T20:01:01.000Z' },
  { id: 'wh_026', eventType: 'transfer.credit',    virtualAccountId: 'acc_005', processed: false, error: 'Webhook endpoint returned 500: Internal Server Error', rawPayload: makePayload('transfer.credit', 'acc_005', 60_000_00, 'Amara Obi'), receivedAt: '2026-06-22T00:00:00.000Z', processedAt: null },
  { id: 'wh_027', eventType: 'account.kyc_update', virtualAccountId: 'acc_020', processed: false, error: 'Connection timeout after 30s — endpoint unreachable', rawPayload: { event: 'account.kyc_update', data: { virtualAccountId: 'acc_020', previousTier: 'tier1', newTier: 'tier2', updatedAt: '2026-06-20T10:00:00Z' }, meta: { version: '1.0' } }, receivedAt: '2026-06-20T10:01:00.000Z', processedAt: null },
  { id: 'wh_028', eventType: 'transfer.credit',    virtualAccountId: 'acc_011', processed: false, error: 'Signature verification failed: HMAC mismatch', rawPayload: makePayload('transfer.credit', 'acc_011', 27_000_00, 'Abdullahi Mustapha'), receivedAt: '2026-06-18T20:01:00.000Z', processedAt: null },
  { id: 'wh_029', eventType: 'transfer.credit',    virtualAccountId: 'acc_006', processed: false, error: null, rawPayload: makePayload('transfer.credit',   'acc_006', 110_000_00,   'Victoria Island Corp'),   receivedAt: '2026-06-23T09:50:00.000Z', processedAt: null },
  { id: 'wh_030', eventType: 'transfer.credit',    virtualAccountId: 'acc_002', processed: false, error: null, rawPayload: makePayload('transfer.credit',   'acc_002', 33_000_00,    'Ugo Okafor'),             receivedAt: '2026-06-23T09:55:00.000Z', processedAt: null },
]
