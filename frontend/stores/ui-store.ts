import {
  ConnectionState,
  ConnectionStateStore,
} from "Frontend/../target/flow-frontend/ConnectionState";
import {
  login as serverLogin,
  logout as serverLogout,
} from "@vaadin/flow-frontend";
import { clearCache } from "./cacheable";

import { makeAutoObservable, runInAction } from "mobx";
import { crmStore } from "./app-store";

class Message {
  constructor(public text = "", public error = false, public open = false) {}
}

export class UiStore {
  loggedIn = true;
  offline = false;

  message = new Message();

  connectionStateStore?: ConnectionStateStore;
  constructor() {
    makeAutoObservable(
      this,
      {
        connectionStateListener: false,
        setupOfflineListener: false,
      },
      { autoBind: true }
    );
    this.setupOfflineListener();
  }

  connectionStateListener = () => {
    this.setOffline(
      this.connectionStateStore?.state === ConnectionState.CONNECTION_LOST
    );
  };

  setupOfflineListener() {
    const $wnd = window as any;
    if ($wnd.Vaadin?.connectionState) {
      this.connectionStateStore = $wnd.Vaadin
        .connectionState as ConnectionStateStore;
      this.connectionStateStore.addStateChangeListener(
        this.connectionStateListener
      );
      this.connectionStateListener();
    }
  }

  async login(username: string, password: string) {
    const result = await serverLogin(username, password);
    if (!result.error) {
      this.setLoggedIn(true);
    } else {
      throw new Error(result.errorMessage || "Login failed");
    }
  }

  async logout() {
    this.setLoggedIn(false);
    clearCache();
    await serverLogout();
  }

  showSuccess(message: string) {
    this.showMessage(message, false);
  }

  showError(message: string) {
    this.showMessage(message, true);
  }

  private showMessage(text: string, error: boolean) {
    this.message = new Message(text, error, true);
    setTimeout(() => runInAction(() => (this.message = new Message())), 5000);
  }

  private setLoggedIn(loggedIn: boolean) {
    this.loggedIn = loggedIn;
    if (loggedIn) {
      crmStore.initFromServer();
    }
  }

  private setOffline(offline: boolean) {
    // Refresh from server when going online
    if (this.offline && !offline) {
      crmStore.initFromServer();
    }
    this.offline = offline;
  }
}
