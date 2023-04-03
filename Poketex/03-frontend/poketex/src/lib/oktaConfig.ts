export const oktaConfig = {
    clientId: '0oa8yl5emm51F4oXq5d7',
    issuer: 'https://dev-22100380.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}