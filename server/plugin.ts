import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { BaalertPluginSetup, BaalertPluginStart } from './types';
import { defineRoutes } from './routes';

export class BaalertPlugin implements Plugin<BaalertPluginSetup, BaalertPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('baalert: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('baalert: Started');
    return {};
  }

  public stop() {}
}
