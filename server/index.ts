import { PluginInitializerContext } from '../../../src/core/server';
import { BaalertPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new BaalertPlugin(initializerContext);
}

export { BaalertPluginSetup, BaalertPluginStart } from './types';
