import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
  SharedGlobalConfig
} from '../../../src/core/server';

import { BaalertPluginSetup, BaalertPluginStart } from './types';
import { defineRoutes } from './routes';
import { first } from 'rxjs/operators';


import type { MyPluginConfig } from './config';
import { Config } from '@kbn/config';


export class BaalertPlugin implements Plugin<BaalertPluginSetup, BaalertPluginStart> {
  private readonly logger: Logger;
  private readonly config: Config;


  constructor(private readonly initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
    this.config = initializerContext.config.get();
  }

  public setup(core: CoreSetup) {
    const { mode: { dev }, packageInfo: { version } } = this.initializerContext.env

    this.logger.debug('baalert: Setup');
    const router = core.http.createRouter();

    
  
    

    // Register server side APIs
    defineRoutes(router, this.config);

    return {};
  }

  public async start(core: CoreStart) {
    // const globalConfiguration: SharedGlobalConfig = await this.initializerContext.config.legacy.globalConfig$.pipe(first()).toPromise();

    // const contextServer = {
    //   config: globalConfiguration
    // };

    // console.log(contextServer)
   

    // const test = config.port;
    // this.logger.debug('baalert: Started');
    return {};
  }

  public stop() {}
}
