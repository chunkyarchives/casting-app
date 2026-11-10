import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr'
import { refreshSession } from '@/lib/api/http'
import { apiBaseUrl } from '@/lib/config'
import type { ChatMessage } from '@/types/conversation'
import type { CrewMemberChange } from '@/types/crew'

export type ChatStatus = 'connecting' | 'connected' | 'offline'

type HubListener = {
  onMessage?: (message: ChatMessage) => void
  onCrewChange?: (change: CrewMemberChange) => void
  onReconnected?: () => void
}

type ChatListener = Required<Pick<HubListener, 'onMessage' | 'onReconnected'>>
type CrewListener = Required<Pick<HubListener, 'onCrewChange'>> & Pick<HubListener, 'onReconnected'>

const retryDelaysMs = [0, 2000, 5000, 10000, 30000]
const busyRetryMs = 300

const listeners = new Set<HubListener>()
const statusListeners = new Set<() => void>()

let status: ChatStatus = 'offline'
let attempt = 0
let needsRefresh = false
let connectedBefore = false
let retryTimer: ReturnType<typeof setTimeout> | undefined

const connection = new HubConnectionBuilder()
  .withUrl(`${apiBaseUrl}/hubs/chat`, {
    withCredentials: true,
    accessTokenFactory: async () => {
      if (needsRefresh) {
        needsRefresh = false
        await refreshSession()
      }
      return ''
    },
  })
  .configureLogging(LogLevel.None)
  .build()

connection.on('MessageReceived', (message: ChatMessage) => {
  listeners.forEach((listener) => listener.onMessage?.(message))
})

connection.on('CrewMemberChanged', (change: CrewMemberChange) => {
  listeners.forEach((listener) => listener.onCrewChange?.(change))
})

connection.onclose(() => {
  setStatus('offline')
  if (listeners.size === 0) return

  needsRefresh = true
  scheduleConnect()
})

function setStatus(next: ChatStatus) {
  status = next
  statusListeners.forEach((notify) => notify())
}

function scheduleConnect() {
  clearTimeout(retryTimer)
  if (listeners.size === 0) return

  const delay = retryDelaysMs[Math.min(attempt, retryDelaysMs.length - 1)]
  attempt += 1
  retryTimer = setTimeout(connect, delay)
}

async function connect() {
  if (listeners.size === 0 || connection.state === HubConnectionState.Connected) return
  if (connection.state !== HubConnectionState.Disconnected) {
    retryTimer = setTimeout(connect, busyRetryMs)
    return
  }

  setStatus('connecting')
  try {
    await connection.start()
  } catch {
    setStatus('offline')
    needsRefresh = true
    scheduleConnect()
    return
  }

  if (listeners.size === 0) {
    void connection.stop()
    return
  }

  attempt = 0
  setStatus('connected')
  if (connectedBefore) listeners.forEach((listener) => listener.onReconnected?.())
  connectedBefore = true
}

function subscribe(listener: HubListener) {
  listeners.add(listener)
  if (listeners.size === 1) {
    attempt = 0
    void connect()
  }

  return () => {
    listeners.delete(listener)
    if (listeners.size > 0) return

    clearTimeout(retryTimer)
    connectedBefore = false
    void connection.stop()
  }
}

export const subscribeToChat = (listener: ChatListener) => subscribe(listener)

export const subscribeToCrew = (listener: CrewListener) => subscribe(listener)

export function subscribeToChatStatus(notify: () => void) {
  statusListeners.add(notify)
  return () => {
    statusListeners.delete(notify)
  }
}

export const chatStatus = () => status