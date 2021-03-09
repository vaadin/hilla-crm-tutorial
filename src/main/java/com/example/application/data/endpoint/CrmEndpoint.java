package com.example.application.data.endpoint;

import java.util.List;

import com.example.application.data.entity.Company;
import com.example.application.data.entity.Contact;
import com.example.application.data.entity.Status;
import com.example.application.data.service.CompanyRepository;
import com.example.application.data.service.ContactRepository;
import com.example.application.data.service.StatusRepository;
import com.vaadin.flow.server.connect.Endpoint;
import com.vaadin.flow.server.connect.auth.AnonymousAllowed;

@Endpoint
@AnonymousAllowed
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

  public static class CrmData {
    public List<Contact> contacts;
    public List<Company> companies;
    public List<Status> statuses;
  }

  public CrmData getCrmData() {
    var crmData = new CrmData();
    crmData.contacts = contactRepository.findAll();
    crmData.companies = companyRepository.findAll();
    crmData.statuses = statusRepository.findAll();
    return crmData;
  }

  public Contact saveContact(Contact contact) {
    contact.setCompany(companyRepository.findById(contact.getCompany().getId()).orElseThrow());
    return contactRepository.save(contact);
  }

  public void deleteContact(Integer contactId) {
    contactRepository.deleteById(contactId);
  }
}
