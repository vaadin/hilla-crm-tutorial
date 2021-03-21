import { customElement, html } from 'lit-element';
import { View } from '../view';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/src/vaadin-grid-column';
import './contact-form';
import { listViewStore } from './list-view-store';
import '@vaadin/vaadin-notification';
import { uiStore } from 'Frontend/stores/app-store';

@customElement('list-view')
export class ListView extends View {
  connectedCallback() {
    super.connectedCallback();
    this.classList.add(
      'box-border',
      'flex',
      'flex-col',
      'p-m',
      'spacing-b-s',
      'w-full',
      'h-full'
    );

    this.autorun(() => {
      if (listViewStore.selectedContact) {
        this.classList.add('editing');
      } else {
        this.classList.remove('editing');
      }
    });
  }

  render() {
    return html`
      <div class="toolbar spacing-e-s">
        <vaadin-text-field
          placeholder="Filter by name"
          .value=${listViewStore.filterText}
          @input=${this.updateFilter}
          clear-button-visible
        ></vaadin-text-field>
        <vaadin-button
          @click=${listViewStore.editNew}
          ?disabled=${uiStore.offline}
          >Add Contact</vaadin-button
        >
      </div>
      <div class="content flex spacing-e-m h-full">
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
          class="flex flex-col spacing-b-s"
          ?hidden=${!listViewStore.selectedContact}
        ></contact-form>
      </div>
      <vaadin-notification
        theme=${uiStore.message.error ? 'error' : 'contrast'}
        position="bottom-start"
        .opened=${uiStore.message.open}
        .renderer=${(root: HTMLElement) =>
          (root.textContent = uiStore.message.text)}
      ></vaadin-notification>
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
