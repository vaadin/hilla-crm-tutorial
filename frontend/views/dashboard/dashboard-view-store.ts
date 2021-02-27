import { RootStore, rootStore } from "Frontend/store/root-store";
import { makeAutoObservable } from "mobx";

class DashboardViewStore {
  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  get contactCount() {
    return this.rootStore.crmStore.contacts.length;
  }

  get companyStats() {
    const countByCompany = this.rootStore.crmStore.contacts.reduce(
      (map, contact) => {
        const name = contact.company.name;
        return map.set(name, (map.get(name) || 0) + 1);
      },
      new Map<string, number>()
    );

    return Array.from(countByCompany.entries()).map(([company, employees]) => ({
      name: company,
      y: employees,
    }));
  }
}

export const dashboardViewStore = new DashboardViewStore(rootStore);
