import "@vaadin/vaadin-charts/src/vaadin-chart-series";
import { customElement, html } from "lit-element";
import { View } from "../view";
import "@vaadin/vaadin-charts";
import { dashboardViewStore } from "./dashboard-view-store";

@customElement("dashboard-view")
export class DashboardView extends View {
  connectedCallback() {
    super.connectedCallback();
    this.classList.add("v-flex", "v-flex-column", "v-items-center", "v-pt-xl");
  }

  render() {
    console.log(dashboardViewStore.companyStats);
    return html`
      <div class="v-font-size-xl v-mb-xl">
        ${dashboardViewStore.contactCount} contacts
      </div>

      ${dashboardViewStore.companyStats.length === 0
        ? html` <p>Loading stats...</p> `
        : html`
            <vaadin-chart type="pie">
              <vaadin-chart-series
                .values=${dashboardViewStore.companyStats}
              ></vaadin-chart-series>
            </vaadin-chart>
          `}
    `;
  }
}
