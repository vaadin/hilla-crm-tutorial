import { customElement, html } from "lit-element";
import { View } from "../view";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-grid";
import "@vaadin/vaadin-grid/src/vaadin-grid-column";
import "./form/contact-form";
import { listViewStore } from "./list-view-store";
import { appState } from "Frontend/store/appstate";

@customElement("list-view")
export class ListView extends View {
  connectedCallback() {
    super.connectedCallback();
    this.classList.add(
      "flex",
      "flex-column",
      "p-m",
      "sb-s",
      "w-full",
      "h-full"
    );

    this.autorun(() => {
      if (listViewStore.selectedContact) {
        this.classList.add("editing");
      } else {
        this.classList.remove("editing");
      }
    });
  }

  render() {
    return html`
      <div class="toolbar se-s">
        <vaadin-text-field
          placeholder="Filter by name"
          .value=${listViewStore.filterText}
          @input=${this.updateFilter}
          clear-button-visible
        ></vaadin-text-field>
        <vaadin-button
          @click=${listViewStore.editNew}
          ?disabled=${appState.offline}
          >Add Contact</vaadin-button
        >
      </div>
      <div class="content flex se-s h-full">
        <vaadin-grid
          class="grid h-full"
          .items=${listViewStore.filteredContacts}
          .selectedItems=${[listViewStore.selectedContact]}
          @active-item-changed=${this.handleGridSelection}
        >
          <vaadin-grid-column path="firstName" auto-width></vaadin-grid-column>
          <vaadin-grid-column path="lastName" auto-width></vaadin-grid-column>
          <vaadin-grid-column path="email" auto-width></vaadin-grid-column>
          <vaadin-grid-column
            path="status.name"
            header="Status"
            auto-width
          ></vaadin-grid-column>
          <vaadin-grid-column
            path="company.name"
            auto-width
            header="Company"
          ></vaadin-grid-column>
        </vaadin-grid>
        <contact-form
          class="flex flex-column self-start sb-s"
          ?hidden=${!listViewStore.selectedContact}
        ></contact-form>
      </div>
    `;
  }

  updateFilter(e: { target: HTMLInputElement }) {
    listViewStore.updateFilter(e.target.value);
  }

  // vaadin-grid fires a null-event when initialized,
  // we are not interested in it.
  first = true;
  handleGridSelection(e: CustomEvent) {
    if (this.first) {
      this.first = false;
      return;
    }
    listViewStore.setSelectedContact(e.detail.value);
  }
}
