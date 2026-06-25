import { USE_MOCK } from '../utils/constants'
import { sleep, generateId } from '../utils/helpers'
import api from './axios'
import { mockAccounts } from './mock'
import type { Account, AccountParams, PaginatedResponse, ProvisionPayload, Transaction } from '../types'

let _accounts: Account[] = [...mockAccounts]

export async function getAccounts(params: AccountParams = {}): Promise<PaginatedResponse<Account>> {
  if (USE_MOCK) {
    await sleep(400)
    let list = [..._accounts]
    if (params.status) list = list.filter((a) => a.status === params.status)
    if (params.kycTier) list = list.filter((a) => a.kycTier === params.kycTier)
    if (params.search) {
      const q = params.search.toLowerCase()
      list = list.filter(
        (a) =>
          a.customerName.toLowerCase().includes(q) ||
          a.accountNumber.includes(q)
      )
    }
    return { data: list, total: list.length }
  }
  const { data } = await api.get<PaginatedResponse<Account>>('/accounts', { params })
  return data
}

export async function getAccount(id: string): Promise<Account | null> {
  if (USE_MOCK) {
    await sleep(300)
    return _accounts.find((a) => a.id === id) ?? null
  }
  const { data } = await api.get<Account>(`/accounts/${id}`)
  return data
}

export async function provisionAccount(payload: ProvisionPayload): Promise<Account> {
  if (USE_MOCK) {
    await sleep(800)
    const acc: Account = {
      id: generateId(),
      accountNumber: String(Math.floor(1_000_000_000 + Math.random() * 9_000_000_000)),
      customerName: payload.customerName,
      customerId: payload.customerId,
      kycTier: payload.kycTier,
      status: 'pending',
      balance: 0,
      lastCreditAt: null,
      createdAt: new Date().toISOString(),
      nombaRef: `NMB-ACC-${Date.now()}`,
    }
    _accounts = [acc, ..._accounts]
    return acc
  }
  const { data } = await api.post<Account>('/accounts', payload)
  return data
}

export async function renameAccount(id: string, name: string): Promise<Account | undefined> {
  if (USE_MOCK) {
    await sleep(300)
    _accounts = _accounts.map((a) =>
      a.id === id ? { ...a, customerName: name } : a
    )
    return _accounts.find((a) => a.id === id)
  }
  const { data } = await api.patch<Account>(`/accounts/${id}`, { customerName: name })
  return data
}

export async function freezeAccount(id: string): Promise<Account | undefined> {
  if (USE_MOCK) {
    await sleep(400)
    _accounts = _accounts.map((a) =>
      a.id === id ? { ...a, status: 'frozen' } : a
    )
    return _accounts.find((a) => a.id === id)
  }
  const { data } = await api.post<Account>(`/accounts/${id}/freeze`)
  return data
}

export async function unfreezeAccount(id: string): Promise<Account | undefined> {
  if (USE_MOCK) {
    await sleep(400)
    _accounts = _accounts.map((a) =>
      a.id === id ? { ...a, status: 'active' } : a
    )
    return _accounts.find((a) => a.id === id)
  }
  const { data } = await api.post<Account>(`/accounts/${id}/unfreeze`)
  return data
}

export async function closeAccount(id: string): Promise<Account | undefined> {
  if (USE_MOCK) {
    await sleep(600)
    _accounts = _accounts.map((a) =>
      a.id === id ? { ...a, status: 'closed', balance: 0 } : a
    )
    return _accounts.find((a) => a.id === id)
  }
  const { data } = await api.post<Account>(`/accounts/${id}/close`)
  return data
}

export async function getAccountStatement(id: string): Promise<(Transaction & { runningBalance: number })[]> {
  if (USE_MOCK) {
    await sleep(400)
    const { mockTransactions } = await import('./mock')
    const txns = mockTransactions.filter((t) => t.virtualAccountId === id)
    let running = 0
    return txns
      .slice()
      .reverse()
      .map((t) => {
        if (t.direction === 'credit') running += t.amount
        else running -= t.amount
        return { ...t, runningBalance: running }
      })
      .reverse()
  }
  const { data } = await api.get<(Transaction & { runningBalance: number })[]>(`/accounts/${id}/statement`)
  return data
}
