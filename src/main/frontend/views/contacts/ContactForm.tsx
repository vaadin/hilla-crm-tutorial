import {TextField} from "@vaadin/react-components/TextField";
import {EmailField} from "@vaadin/react-components/EmailField";
import {Select, SelectItem} from "@vaadin/react-components/Select";
import {Button} from "@vaadin/react-components/Button";
import {useForm} from "@vaadin/hilla-react-form";
import ContactRecordModel from "Frontend/generated/com/example/application/services/CRMService/ContactRecordModel";
import {CRMService} from "Frontend/generated/endpoints";
import {useEffect, useState} from "react";
import ContactRecord from "Frontend/generated/com/example/application/services/CRMService/ContactRecord";

interface ContactFormProps {
    contact?: ContactRecord | null;
    onSubmit?: (contact: ContactRecord) => Promise<void>;
}

export default function ContactForm({contact, onSubmit}: ContactFormProps) {

    const [companies, setCompanies] = useState<SelectItem[]>([]);

    const {field, model, submit, reset, read} = useForm(ContactRecordModel, { onSubmit } );

    useEffect(() => {
        read(contact);
    }, [contact]);

    useEffect(() => {
        getCompanies();
    }, []);

    async function getCompanies() {
        const companies = await CRMService.findAllCompanies();
        const companyItems = companies.map(company => {
            return {
                label: company.name,
                value: company.id + ""
            };
        });
        setCompanies(companyItems);
    }

    return (
        <div className="flex flex-col gap-s items-start">

            <TextField label="First name" {...field(model.firstName)} />
            <TextField label="Last name" {...field(model.lastName)} />
            <EmailField label="Email" {...field(model.email)} />
            <Select label="Company" items={companies} {...field(model.company.id)} />

            <div className="flex gap-m">
                <Button onClick={submit} theme="primary">Save</Button>
                <Button onClick={reset}>Reset</Button>
            </div>
        </div>
    )
}