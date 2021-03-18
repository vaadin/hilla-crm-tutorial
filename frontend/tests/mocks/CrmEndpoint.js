import sinon from "sinon";

const getCrmData = sinon.stub().callsFake(() => {
  return {
    companies: [
      { name: "Company 1", employees: [] },
      { name: "Company 2", employees: [] },
    ],
    statuses: ["New", "Contacted"],
    contacts: [],
  };
});

const saveContact = sinon.stub().callsFake(() => {
  return Promise.resolve();
});

const deleteContact = sinon.stub();

export { getCrmData, saveContact, deleteContact };
