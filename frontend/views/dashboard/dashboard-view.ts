import "@vaadin/vaadin-charts/src/vaadin-chart-series";
import { customElement, html } from "lit-element";
import { View } from "../view";
import "@vaadin/vaadin-charts";
import { dashboardViewStore } from "./dashboard-view-store";
import { uiStore } from "Frontend/store/root-store";

@customElement("dashboard-view")
export class DashboardView extends View {
  connectedCallback() {
    super.connectedCallback();
    this.classList.add("flex", "flex-column", "items-center", "pt-xl");
  }

  render() {
    return html`
      <div class="font-size-xl mb-xl">
        ${dashboardViewStore.contactCount} contacts
      </div>

      ${this.getCompanyStats()}
    `;
  }

  getCompanyStats() {
    if (dashboardViewStore.companyStats.length === 0) {
      if (uiStore.offline) {
        return html`<p>Connect to the internet to view stats</p>`;
      } else {
        return html`<p>Loading stats...</p>`;
      }
    } else {
      return html`
        <vaadin-chart type="pie">
          <vaadin-chart-series
            .values=${dashboardViewStore.companyStats}
          ></vaadin-chart-series>
        </vaadin-chart>
      `;
    }
  }
}
