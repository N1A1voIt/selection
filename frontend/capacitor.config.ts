import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'frontend',
  webDir: 'www/browser',
  android: {
    minWebViewVersion: 22,
    webContentsDebuggingEnabled: true
  }
};
export default config;
