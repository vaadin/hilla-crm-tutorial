import { makeAutoObservable, observable, runInAction } from "mobx";

import Company from "Frontend/generated/com/vaadin/crm/data/entity/Company";
import Contact from "Frontend/generated/com/vaadin/crm/data/entity/Contact";
import Status from "Frontend/generated/com/vaadin/crm/data/entity/Status";
import * as endpoint from "Frontend/generated/CrmEndpoint";
import CrmDataModel from "Frontend/generated/com/vaadin/crm/data/endpoint/CrmEndpoint/CrmDataModel";
import { cacheable } from "./cacheable";
import { uiStore } from "./app-store";

export class CrmStore {
  contacts: Contact[] = [];
  companies: Company[] = [];
  statuses: Status[] = [];

  constructor() {
    makeAutoObservable(
      this,
      {
        initFromServer: false,
        contacts: observable.shallow,
        companies: observable.shallow,
        statuses: observable.shallow,
      },
      { autoBind: true }
    );

    this.initFromServer();
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
      uiStore.showSuccess("Contact saved.");
    } catch (e) {
      console.log(e);
      uiStore.showError("Contact save failed.");
    }
  }

  async deleteContact(contact: Contact) {
    if (!contact.id) return;

    try {
      await endpoint.deleteContact(contact.id);
      this.deleteLocal(contact);
      uiStore.showSuccess("Contact deleted.");
    } catch (e) {
      console.log(e);
      uiStore.showError("Failed to delete contact.");
    }
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
