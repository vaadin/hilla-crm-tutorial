import { View } from "Frontend/views/view";
import { customElement, html } from "lit-element";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-combo-box";
import "@vaadin/vaadin-button";
import { listViewStore } from "./list-view-store";
import { Binder, field } from "Frontend/../target/flow-frontend/form";
import ContactModel from "Frontend/generated/com/vaadin/crm/data/entity/ContactModel";
import { crmStore, uiStore } from "Frontend/store/root-store";

@customElement("contact-form")
export class ContactForm extends View {
  private binder = new Binder(this, ContactModel);
  constructor() {
    super();
    this.autorun(() =>
      this.binder.read(
        listViewStore.selectedContact || ContactModel.createEmptyValue()
      )
    );
  }
  render() {
    const { model } = this.binder;
    return html`
      <vaadin-text-field
        label="First name"
        ?disabled=${uiStore.offline}
        ...=${field(model.firstName)}
      ></vaadin-text-field>
      <vaadin-text-field
        label="Last name"
        ?disabled=${uiStore.offline}
        ...=${field(model.lastName)}
      ></vaadin-text-field>
      <vaadin-text-field
        label="Email"
        ?disabled=${uiStore.offline}
        ...=${field(model.email)}
      ></vaadin-text-field>
      <vaadin-combo-box
        label="Status"
        .items=${crmStore.statuses}
        item-label-path="name"
        ?disabled=${uiStore.offline}
        ...=${field(model.status)}
      ></vaadin-combo-box>

      <vaadin-combo-box
        label="Company"
        item-label-path="name"
        .items=${crmStore.companies}
        ?disabled=${uiStore.offline}
        ...=${field(model.company)}
      >
      </vaadin-combo-box>
      <div class="buttons se-s">
        <vaadin-button
          theme="primary"
          @click=${this.save}
          ?disabled=${this.binder.invalid || uiStore.offline}
        >
          ${this.binder.value.id ? "Save" : "Create"}
        </vaadin-button>
        <vaadin-button
          theme="error"
          @click=${listViewStore.delete}
          ?disabled=${!this.binder.value.id || uiStore.offline}
        >
          Delete</vaadin-button
        >
        <vaadin-button theme="tertiary" @click=${listViewStore.cancelEdit}>
          Cancel</vaadin-button
        >
      </div>
    `;
  }

  async save() {
    await this.binder.submitTo(listViewStore.save);
    this.binder.clear();
  }
}
