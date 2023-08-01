import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { View } from 'Frontend/views/view';
import '@vaadin/charts';
import '@vaadin/charts/src/vaadin-chart-series';
import { dashboardViewStore } from './dashboard-view-store';

@customElement('dashboard-view')
export class DashboardView extends View {
  connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'flex-col', 'items-center', 'pt-xl');
  }

  render() {
    return html`
      <div class="text-xl mb-xl">
        ${dashboardViewStore.contactCount} contacts
      </div>

      ${this.getCompanyStats()}
    `;
  }

  getCompanyStats() {
    if (dashboardViewStore.companyStats.length === 0) {
      return html`<p>Loading stats...</p>`;
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
