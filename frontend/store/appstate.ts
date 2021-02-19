import Company from "Frontend/generated/com/vaadin/crm/data/entity/Company";
import Contact from "Frontend/generated/com/vaadin/crm/data/entity/Contact";
import Status from "Frontend/generated/com/vaadin/crm/data/entity/Status";
import * as endpoint from "Frontend/generated/CrmEndpoint";
import {
  login as serverLogin,
  logout as serverLogout,
} from "@vaadin/flow-frontend";
import {
  ConnectionState,
  ConnectionStateStore,
} from "@vaadin/flow-frontend/ConnectionState";
import { makeAutoObservable, observable, runInAction } from "mobx";
import { cacheable, clearCache } from "./cacheable";
import CrmDataModel from "Frontend/generated/com/vaadin/crm/data/endpoint/CrmEndpoint/CrmDataModel";

export class AppState {
  loggedIn = true;
  offline = false;
  contacts: Contact[] = [];
  companies: Company[] = [];
  statuses: Status[] = [];
  message = {
    text: "",
    error: false,
    open: false,
  };
  connectionStateStore?: ConnectionStateStore;
  connectionStateListener = () => {
    this.setOffline(
      this.connectionStateStore?.state === ConnectionState.CONNECTION_LOST
    );
  };

  constructor() {
    makeAutoObservable(
      this,
      {
        initFromServer: false,
        connectionStateListener: false,
        setupOfflineListener: false,
        contacts: observable.shallow,
        companies: observable.shallow,
        statuses: observable.shallow,
      },
      { autoBind: true }
    );

    this.setupOfflineListener();
    this.initFromServer();
  }

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

  async initFromServer() {
    const data = await cacheable(
      endpoint.getCrmData,
      "crm",
      CrmDataModel.createEmptyValue()
    );

    runInAction(() => {
      this.contacts = data.contacts;
      this.companies = data.companies;
      this.statuses = data.statuses;
    });
  }

  async saveContact(contact: Contact) {
    try {
      this.saveLocal(await endpoint.saveContact(contact));
      this.showSuccess("Contact saved.");
    } catch (e) {
      console.log(e);
      this.showError("Contact save failed.");
    }
  }

  async deleteContact(contact: Contact) {
    if (!contact.id) return;

    try {
      await endpoint.deleteContact(contact.id);
      this.deleteLocal(contact);
      this.showSuccess("Contact deleted.");
    } catch (e) {
      console.log(e);
      this.showError("Failed to delete contact.");
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

  private showSuccess(message: string) {
    this.showMessage(message, false);
  }

  private showError(message: string) {
    this.showMessage(message, true);
  }

  private setLoggedIn(loggedIn: boolean) {
    this.loggedIn = loggedIn;
    if (loggedIn) {
      this.initFromServer();
    }
  }

  private setOffline(offline: boolean) {
    // Refresh from server when going online
    if (this.offline && !offline) {
      this.initFromServer();
    }
    this.offline = offline;
  }

  private showMessage(text: string, error: boolean) {
    this.message = {
      text,
      error,
      open: true,
    };
    setTimeout(() => runInAction(() => (this.message.open = false)), 5000);
  }

  private saveLocal(contact: Contact) {
    if (this.contacts.some((c) => c.id === contact.id)) {
      this.contacts = this.contacts.map((c) =>
        c.id === contact.id ? contact : c
      );
    } else {
      this.contacts.push(contact);
    }
  }

  private deleteLocal(contact: Contact) {
    this.contacts = this.contacts.filter((c) => c.id !== contact.id);
  }
}
export const appState = new AppState();
