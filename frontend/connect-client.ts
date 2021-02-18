import { MiddlewareContext } from "@vaadin/flow-frontend";
import { MiddlewareNext } from "@vaadin/flow-frontend";
import { ConnectClient } from "@vaadin/flow-frontend";
import { appState } from "./store/appstate";

const client = new ConnectClient({
  prefix: "connect",
  middlewares: [
    async (context: MiddlewareContext, next: MiddlewareNext) => {
      const response = await next(context);
      // Log out if the session has expired
      if (response.status === 401) {
        appState.logout();
      }
      return response;
    },
  ],
});

export default client;
