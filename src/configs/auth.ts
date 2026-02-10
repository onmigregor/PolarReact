export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/auth/login',
  logoutEndpoint: '/auth/logout',
  registerEndpoint: '/auth/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
