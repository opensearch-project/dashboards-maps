/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export default class GeospatialService {
  constructor(driver) {
    this.driver = driver;
  }

  uploadGeojson = async (context, req, res) => {
    const dataSourceRefId = req.query.dataSourceId;
    let uploadResponse;
    try {
      if (dataSourceRefId) {
        const remoteDataSourceClient = context.dataSource.opensearch.legacy.getClient(
          dataSourceRefId
        ).callAPI;
        uploadResponse = await remoteDataSourceClient('geospatial.geospatialQuery', {
          body: req.body,
        });
      } else {
        const { callAsCurrentUser } = await this.driver.asScoped(req);
        uploadResponse = await callAsCurrentUser('geospatial.geospatialQuery', {
          body: req.body,
        });
      }

      return res.ok({
        body: {
          ok: true,
          resp: uploadResponse,
        },
      });
    } catch (err) {
      return res.ok({
        body: {
          ok: false,
          resp: err.message,
        },
      });
    }
  };
}
