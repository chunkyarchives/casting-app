export type Decision = 'accept' | 'reject'

export const decisionButtonClass: Record<Decision, string> = {
  accept: 'bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/40',
  reject: 'bg-red-600 text-white hover:bg-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40',
}