import { UiStore } from "./ui-store";
import { CrmStore } from "./crm-store";

export class RootStore {
  uiStore = new UiStore();
  crmStore = new CrmStore();
}

export const rootStore = new RootStore();
export const uiStore = rootStore.uiStore;
export const crmStore = rootStore.crmStore;
