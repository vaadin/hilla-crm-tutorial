import ContactRecord from 'Frontend/generated/com/example/application/services/CRMService/ContactRecord';
import {useEffect, useState} from 'react';
import {CRMService} from "Frontend/generated/endpoints";
import {Grid} from "@hilla/react-components/Grid";
import {GridColumn} from "@hilla/react-components/GridColumn";

export default function ContactsView() {
    const [contacts, setContacts] = useState<ContactRecord[]>([]);
    const [selected, setSelected] = useState<ContactRecord | null | undefined>();

    useEffect(() => {
        CRMService.findAllContacts().then(setContacts);
    }, []);

    return (
        <div className="p-m flex gap-m">
            <Grid
                items={contacts}
                onActiveItemChanged={e => setSelected(e.detail.value)}
                selectedItems={[selected]}>

                <GridColumn path="firstName"/>
                <GridColumn path="lastName"/>
                <GridColumn path="email" autoWidth/>
                <GridColumn path="company.name" header="Company name"/>
            </Grid>
        </div>
    );
}