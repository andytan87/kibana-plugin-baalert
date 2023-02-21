import { IRouter } from '../../../../src/core/server';
import fetch from "node-fetch";

export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/baalert/example',
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
      const response = await fetch('http://localhost:8081/test');
      const result = await response.json();
      console.log(result);
      return res.ok({ 
        body: { 
          message: result.message,
        },
      });
    }
  );
}

