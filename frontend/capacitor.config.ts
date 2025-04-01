import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Kapic',
  webDir: 'www/browser',
  android: {
    minWebViewVersion: 22,
    webContentsDebuggingEnabled: true
  }
};
export default config;
