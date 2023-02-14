/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { first } from 'rxjs/operators';
import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { HomeServerPluginSetup } from '../../../src/plugins/home/server';
import { getFlightsSavedObjects } from './services/sample_data/flights_saved_objects';

import {
  AppPluginSetupDependencies,
  CustomImportMapPluginSetup,
  CustomImportMapPluginStart,
} from './types';
import { createGeospatialCluster } from './clusters';
import { GeospatialService, OpensearchService } from './services';
import { geospatial, opensearch } from '../server/routes';
import { mapSavedObjectsType } from './saved_objects';
import { capabilitiesProvider } from './saved_objects/capabilities_provider';
import { ConfigSchema } from '../common/config';

export class CustomImportMapPlugin
  implements Plugin<CustomImportMapPluginSetup, CustomImportMapPluginStart> {
  private readonly logger: Logger;
  private readonly globalConfig$;
  private readonly config$;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
    this.globalConfig$ = initializerContext.config.legacy.globalConfig$;
    this.config$ = initializerContext.config.create<ConfigSchema>();
  }

  // Adds dashboards-maps saved objects to existing sample datasets using home plugin
  private addMapsSavedObjects(home: HomeServerPluginSetup, config: ConfigSchema) {
    home.sampleData.addSavedObjectsToSampleDataset('flights', getFlightsSavedObjects(config));
  }

  public async setup(core: CoreSetup, plugins: AppPluginSetupDependencies) {
    this.logger.debug('customImportMap: Setup');
    // @ts-ignore
    const globalConfig = await this.globalConfig$.pipe(first()).toPromise();
    // @ts-ignore
    const config = (await this.config$.pipe(first()).toPromise()) as ConfigSchema;

    const geospatialClient = createGeospatialCluster(core, globalConfig);
    // Initialize services
    const geospatialService = new GeospatialService(geospatialClient);
    const opensearchService = new OpensearchService(geospatialClient);

    const router = core.http.createRouter();
    const { home } = plugins;

    // Register server side APIs
    geospatial(geospatialService, router);
    opensearch(opensearchService, router);

    // Register saved object types
    core.savedObjects.registerType(mapSavedObjectsType);

    // Register capabilities
    core.capabilities.registerProvider(capabilitiesProvider);

    if (home) this.addMapsSavedObjects(home, config);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('customImportMap: Started');
    return {};
  }

  public stop() {}
}
