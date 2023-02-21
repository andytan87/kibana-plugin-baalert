import './index.scss';

import { BaalertPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new BaalertPlugin();
}
export { BaalertPluginSetup, BaalertPluginStart } from './types';
