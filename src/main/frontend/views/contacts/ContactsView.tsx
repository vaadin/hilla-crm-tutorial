import ContactRecord from 'Frontend/generated/com/example/application/services/CRMService/ContactRecord';
import {useEffect, useState} from 'react';
import {CRMService} from "Frontend/generated/endpoints";
import {Grid} from "@vaadin/react-components/Grid";
import {GridColumn} from "@vaadin/react-components/GridColumn";
import ContactForm from "Frontend/views/contacts/ContactForm";

export default function ContactsView() {
    const [contacts, setContacts] = useState<ContactRecord[]>([]);
    const [selected, setSelected] = useState<ContactRecord | null | undefined>();

    useEffect(() => {
        CRMService.findAllContacts().then(setContacts);
    }, []);

    async function onContactSaved(contact: ContactRecord) {
        const saved = await CRMService.save(contact)
        if (contact.id) {
            setContacts(contacts => contacts.map(current => current.id === saved.id ? saved : current));
        } else {
            setContacts(contacts => [...contacts, saved]);
        }
        setSelected(saved);
    }

    return (
        <div className="p-m flex gap-m">
            <Grid
                items={contacts}
                onActiveItemChanged={e => setSelected(e.detail.value)}
                selectedItems={[selected]}>

                <GridColumn path="firstName"/>
                <GridColumn path="lastName"/>
                <GridColumn path="email"/>
                <GridColumn path="company.name" header="Company name"/>
            </Grid>

            {selected &&
                <ContactForm contact={selected} onSubmit={onContactSaved}/>
            }
        </div>
    );
}