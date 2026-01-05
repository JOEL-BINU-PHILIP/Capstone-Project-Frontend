export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080', // API Gateway - ALL requests go through here
    tokenRefreshInterval: 14 * 60 * 1000, // 14 minutes (access token expires in 15 min)
    sessionTimeout: 30 * 60 * 1000, // 30 minutes of inactivity
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'current_user'
};
