export const environment = {
    production: true,
    apiUrl: 'https://api.homeserviceplatform.com', // Production API Gateway URL
    tokenRefreshInterval: 14 * 60 * 1000,
    sessionTimeout: 30 * 60 * 1000,
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'current_user'
};
