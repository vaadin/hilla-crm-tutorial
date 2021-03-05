import { UiStore } from "./ui-store";
import { CrmStore } from "./crm-store";

export class AppStore {
  uiStore = new UiStore();
  crmStore = new CrmStore();
}

export const appStore = new AppStore();
export const uiStore = appStore.uiStore;
export const crmStore = appStore.crmStore;
