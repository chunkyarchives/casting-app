export const dashboardPages = {
    welcome: () => import('./welcome/Welcome'),
    accountSettings: () => import('./settings/AccountSettings'),
    themeSettings: () => import('./settings/ThemeSettings'),
    chat: () => import('./chat/Chat'),
}