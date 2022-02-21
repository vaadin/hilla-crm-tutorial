import {
  MiddlewareContext,
  MiddlewareNext,
  ConnectClient,
} from '@hilla/frontend';
import { uiStore } from './stores/app-store';

const client = new ConnectClient({
  prefix: 'connect',
  middlewares: [
    async (context: MiddlewareContext, next: MiddlewareNext) => {
      const response = await next(context);
      // Log out if the authentication has expired
      if (response.status === 401) {
        uiStore.logout();
      }
      return response;
    },
  ],
});

export default client;
