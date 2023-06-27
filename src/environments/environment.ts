import { EnvironmentInterface } from './environment.interface';

export const environment: EnvironmentInterface = {
  production: false,
  apiURL: 'https://scoring-api.ponddy.com/english/',
  devApiURL: 'https://alpha.ponddy-one.com:9479',
  authApiUrl: 'https://auth.ponddy.com',
  devAuthApiUrl: 'https://auth-dev.ponddy.com',
  clientId: 'c6af148e-438e-4257-babf-cb6cbbb6c540',
  devClientId: 'e7266342-a529-4253-a3c5-4105abb5c8d6',
  apiUrl: 'https://voice-buddy-api.xkernel.com/api/v1',
  // apiUrl: 'https://voice-buddy-api.ponddy.com/api/v1',
  devApiUrl: 'https://voice-buddy-develop-api.ponddy.com/api/v1',
  redirectUri: 'https://voicebuddy.ponddy.com/',
  devRedirectUri: 'https://voicebuddy-dev.ponddy.com/'
};
