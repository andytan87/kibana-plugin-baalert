import { IRouter } from '../../../../src/core/server';
import fetch from "node-fetch";
import { Config } from '@kbn/config';

import { schema } from '@kbn/config-schema';

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
      path: '/api/elastalert/rules/{team}/{rule}',
      validate: {
        params: schema.object({
          team: schema.string(),
          rule: schema.string()
        }),
      },
    },
    async (context, req, res) => {
      const response = await fetch(config.url + '/rules' + '/' + req.params.team + '/' + req.params.rule);
      const result = await response.text();
      

      return res.ok({
        body: {
          data: result,
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
      // console.log(config.url);
      const response = await fetch(config.url + '/rules');
      const result = await response.json();
      return res.ok({
        body: {
          directories: result.directories,
        },
      });
    }
  );

  router.get(
    {
      path: '/api/baalert/bitbucket',
      validate: false,
    },
    async (context, req, res) => {
      // console.log(config.url);
      const response = await fetch(config.url + '/rules-bitbucket');
      const result = await response.json();
      return res.ok({
        body: {
          directories: result.directories,
        },
      });
    }
  );


  router.get(
    {
      path: '/api/elastalert/rules/{team}',
      validate: {
        params: schema.object({
          team: schema.string()
        }),
      },
    },
    async (context, req, res) => {
      const response = await fetch(config.url + '/rules' + '/' + req.params.team);
      const result = await response.json();
      console.log(result);
      return res.ok({
        body: {
          data: result,
        },
      });
    }
  );

  router.post(
    {
      path: '/api/elastalert/stream/{team}/{rule}',
      validate: {
        params: schema.object({
          team: schema.string(),
          rule: schema.string()
        }),
        body: schema.object({
          yaml: schema.string()
        }),
      }
    },
    async (context, req, res) => {
      const response = await fetch(
        config.url + '/stream/' + req.params.team + '/' + req.params.rule,
        {
          method: 'post',
          body: JSON.stringify(req.body),
          headers: {'Content-Type': 'application/json'}
        }
      );
      const result = await response.text();
      console.log("result");
      console.log(result);
      return res.ok({
        body: {
          data: result,
        },
      });
    }
  );

  
  router.get(
    {
      path: '/api/elastalert/containerstatus',
      validate: false,
    },
    async (context, req, res) => {
      const response = await fetch(config.url + '/container-status');
      const result = await response.json();
      console.log(result)
      return res.ok({
        body: {
          data: result.results,
        },
      });
    }
  );

  router.get(
    {
      path: '/api/elastalert/containerstatus-bitbucket',
      validate: false,
    },
    async (context, req, res) => {
      const response = await fetch(config.url + '/container-status-bitbucket');
      const result = await response.json();
      console.log(result)
      return res.ok({
        body: {
          data: result.results,
        },
      });
    }
  );


  router.post(
    {
      path: '/api/elastalert/rules/{team}/{rule}',
      validate: {
        params: schema.object({
          team: schema.string(),
          rule: schema.string()
        }),
        body: schema.object({
          yaml: schema.string()
        }),
      }
    },
    async (context, req, res) => {
      console.log("test");
      console.log(req.params);
      console.log(req.body)
      const response = await fetch(
        config.url + '/rules/' + req.params.team + '/' + req.params.rule,
        {
          method: 'post',
          body: JSON.stringify(req.body),
          headers: {'Content-Type': 'application/json'}
        }
      );
      const result = await response;
      return res.ok({
        body: {
          directories: "good",
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

