import Contact from "Frontend/generated/com/vaadin/crm/data/entity/Contact";
import ContactModel from "Frontend/generated/com/vaadin/crm/data/entity/ContactModel";
import { AppState, appState } from "Frontend/store/appstate";
import { makeAutoObservable, observable } from "mobx";

class ListViewStore {
  selectedContact?: Contact = undefined;
  filterText = "";

  constructor(private appState: AppState) {
    makeAutoObservable(
      this,
      {
        selectedContact: observable.ref,
      },
      { autoBind: true }
    );
  }

  updateFilter(filterText: string) {
    this.filterText = filterText;
  }

  setSelectedContact(contact: Contact) {
    this.selectedContact = contact;
  }

  editNew() {
    this.selectedContact = ContactModel.createEmptyValue();
  }

  cancelEdit() {
    this.selectedContact = undefined;
  }

  async save(contact: Contact) {
    await appState.saveContact(contact);
    this.cancelEdit();
  }

  async delete() {
    if (this.selectedContact) {
      await appState.deleteContact(this.selectedContact);
      this.cancelEdit();
    }
  }

  get filteredContacts() {
    const filter = new RegExp(this.filterText, "i");
    const contacts = this.appState.contacts;
    return contacts.filter((contact) =>
      filter.test(`${contact.firstName} ${contact.lastName}`)
    );
  }
}

export const listViewStore = new ListViewStore(appState);
