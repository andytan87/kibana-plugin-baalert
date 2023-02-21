import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface BaalertPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaalertPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
