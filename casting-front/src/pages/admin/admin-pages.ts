export const adminPages = {
  statistics: () => import('./Statistics'),
  accounts: () => import('./Accounts'),
  productions: () => import('./Productions'),
  auditLogs: () => import('./AuditLogs'),
}

export function preloadAdminPages() {
  Object.values(adminPages).forEach((load) => load().catch(() => {}))
}