export const dashboardPages = {
    welcome: () => import('./welcome/Welcome'),
    accountSettings: () => import('./settings/AccountSettings'),
    themeSettings: () => import('./settings/ThemeSettings'),
    privacySettings: () => import('./settings/PrivacySettings'),
    chat: () => import('./chat/Chat'),
}