import { makeAutoObservable } from 'mobx';
import {
  login as serverLogin,
  logout as serverLogout,
} from '@hilla/frontend';
import { crmStore } from './app-store';
import { ConnectionState, ConnectionStateStore } from '@vaadin/common-frontend';

class Message {
  constructor(public text = '', public error = false, public open = false) {}
}

export class UiStore {
  message = new Message();
  loggedIn = true;
  offline = false;

  constructor() {
    makeAutoObservable(
      this,
      {
        connectionStateListener: false,
        connectionStateStore: false,
        setupOfflineListener: false,
      },
      { autoBind: true }
    );
    this.setupOfflineListener();
  }

  connectionStateStore?: ConnectionStateStore;

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

  private setOffline(offline: boolean) {
    // Refresh from server when going online
    if (this.offline && !offline) {
      crmStore.initFromServer();
    }
    this.offline = offline;
  }

  async login(username: string, password: string) {
    const result = await serverLogin(username, password);
    if (!result.error) {
      this.setLoggedIn(true);
    } else {
      throw new Error(result.errorMessage || 'Login failed');
    }
  }

  async logout() {
    await serverLogout();
    this.setLoggedIn(false);
  }

  setLoggedIn(loggedIn: boolean) {
    this.loggedIn = loggedIn;
    if (loggedIn) {
      crmStore.initFromServer();
    }
  }

  showSuccess(message: string) {
    this.showMessage(message, false);
  }

  showError(message: string) {
    this.showMessage(message, true);
  }

  clearMessage() {
    this.message = new Message();
  }

  private showMessage(text: string, error: boolean) {
    this.message = new Message(text, error, true);
    setTimeout(() => this.clearMessage(), 5000);
  }
}
