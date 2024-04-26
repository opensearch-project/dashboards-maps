/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export default class OpensearchService {
  constructor(driver) {
    this.driver = driver;
  }

  getIndex = async (context, req, res) => {
    const dataSourceRefId = req.query.dataSourceId;
    try {
      if (dataSourceRefId) {
        const remoteDataSourceClient = context.dataSource.opensearch.legacy.getClient(
          dataSourceRefId
        ).callAPI;
        const { index } = req.body;
        const indices = await remoteDataSourceClient('cat.indices', {
          index,
          format: 'json',
          h: 'health,index,status',
        });
      } else {
        const { callAsCurrentUser } = this.driver.asScoped(req);
        const { index } = req.body;
        const indices = await callAsCurrentUser;
      }
      return res.ok({
        body: {
          ok: true,
          resp: indices,
        },
      });
    } catch (err) {
      // Opensearch throws an index_not_found_exception which we'll treat as a success
      if (err.statusCode === 404) {
        return res.ok({
          body: {
            ok: false,
            resp: [],
          },
        });
      } else {
        return res.ok({
          body: {
            ok: false,
            resp: err.message,
          },
        });
      }
    }
  };
}
