import { PluginInitializerContext } from '../../../src/core/server';
import { BaalertPlugin } from './plugin';
import { schema, TypeOf } from '@kbn/config-schema';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export const config = {
  schema: schema.object({
    enabled: schema.boolean({ defaultValue: true }),
    url: schema.string({ defaultValue: 'http://localhost:8081' }),
  }),
}

export function plugin(initializerContext: PluginInitializerContext) {
  return new BaalertPlugin(initializerContext);
}

export type DemoPluginConfig = TypeOf<typeof config.schema>;
export { BaalertPluginSetup, BaalertPluginStart } from './types';
