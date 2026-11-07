export const dashboardPages = {
    accountSettings: () => import('./settings/AccountSettings'),
    themeSettings: () => import('./settings/ThemeSettings'),
    chat: () => import('./chat/Chat'),
}