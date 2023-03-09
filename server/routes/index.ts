import { IRouter } from '../../../../src/core/server';
import fetch from "node-fetch";
import { Config } from '@kbn/config';

export function defineRoutes(router: IRouter, config: Config) {



  router.get(
    {
      path: '/internal/foo/bar',
      validate: false,
    },
    async (context, request, response) => {
      return response.ok({
        body: {
          time: new Date().toISOString(),
        },
      });
    }
  );

  router.get(
    {
      path: '/api/baalert/test',
      validate: false,
    },
    async (context, req, res) => {
      const response = await fetch(config.url + '/rules');
      const result = await response.json();
      return res.ok({
        body: {
          directories: result.directories,
        },
      });
    }
  );


  router.post(
    {
      path: '/api/baalert/successfull',
      validate: false,
    },
    async (context, request, response) => {
      const results = await context.core.elasticsearch.client.asCurrentUser.search({
        index: 'elastalert_status',
        body: {
          query: {
            bool: {
              must: {
                term: {
                  alert_sent: "true"
                }
              },
              filter: {
                range: {
                  "@timestamp": {
                    gt: "now-1d/d",
                    lt: "now"
                  }
                }
              }
            }
          }

        }
      })
      // console.log(results.body.hits.total.value)
      return response.ok({
        body: {
          message: results.body.hits.total.value,
        },
      });
    }
  );



  router.post(
    {
      path: '/api/baalert/failed',
      validate: false,
    },
    async (context, request, response) => {
      const results = await context.core.elasticsearch.client.asCurrentUser.search({
        index: 'elastalert_status',
        body: {
          query: {
            bool: {
              must: {
                term: {
                  alert_sent: "false"
                }
              },
              filter: {
                range: {
                  "@timestamp": {
                    gt: "now-1d/d",
                    lt: "now"
                  }
                }
              }
            }
          }

        }
      })
      // console.log(results.body.hits.total.value);
      return response.ok({
        body: {
          message: results.body.hits.total.value,
        },
      });
    }
  );


  router.post(
    {
      path: '/api/baalert/total',
      validate: false,
    },
    async (context, request, response) => {
      const results = await context.core.elasticsearch.client.asCurrentUser.search({
        index: 'elastalert_status',
        body: {
          query: {
            bool: {
              should: {
                exists: {
                  field: "alert_sent"
                }
              },
              filter: {
                range: {
                  "@timestamp": {
                    gt: "now-1d/d",
                    lt: "now"
                  }
                }
              }
            }
          }

        }
      })
      // console.log(results.body.hits.total.value);
      return response.ok({
        body: {
          message: results.body.hits.total.value,
        },
      });
    }
  );

}

