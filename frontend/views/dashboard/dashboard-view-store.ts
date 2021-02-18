import { AppState, appState } from "Frontend/store/appstate";
import { makeAutoObservable } from "mobx";

class DashboardViewStore {
  constructor(private appState: AppState) {
    makeAutoObservable(this);
  }

  get contactCount() {
    return this.appState.contacts.length;
  }

  get companyStats() {
    const countByCompany = this.appState.contacts.reduce((map, contact) => {
      const name = contact.company.name;
      return map.set(name, (map.get(name) || 0) + 1);
    }, new Map<string, number>());

    return Array.from(countByCompany.entries()).map(([company, employees]) => ({
      name: company,
      y: employees,
    }));
  }
}

export const dashboardViewStore = new DashboardViewStore(appState);
