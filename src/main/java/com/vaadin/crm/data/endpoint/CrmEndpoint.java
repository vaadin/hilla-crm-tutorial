package com.vaadin.crm.data.endpoint;

import java.util.List;

import com.vaadin.crm.data.entity.Company;
import com.vaadin.crm.data.entity.Contact;
import com.vaadin.crm.data.entity.Status;
import com.vaadin.crm.data.service.CompanyRepository;
import com.vaadin.crm.data.service.ContactRepository;
import com.vaadin.crm.data.service.StatusRepository;
import com.vaadin.flow.server.connect.Endpoint;

@Endpoint
public class CrmEndpoint {

  private ContactRepository contactRepository;
  private CompanyRepository companyRepository;
  private StatusRepository statusRepository;

  public CrmEndpoint(ContactRepository contactRepository, CompanyRepository companyRepository,
      StatusRepository statusRepository) {
    this.contactRepository = contactRepository;
    this.companyRepository = companyRepository;
    this.statusRepository = statusRepository;

  }

  public List<Contact> findAllContacts() {
    return contactRepository.findAll();
  }

  public List<Company> findAllCompanies() {
    return companyRepository.findAll();
  }

  public List<Status> getStatuses() {
    return statusRepository.findAll();
  }

  public Contact saveContact(Contact contact) {
    contact.setCompany(companyRepository.findById(contact.getCompany().getId()).orElseThrow());
    return contactRepository.save(contact);
  }

  public void deleteContact(Integer contactId) {
    contactRepository.deleteById(contactId);
  }
}
