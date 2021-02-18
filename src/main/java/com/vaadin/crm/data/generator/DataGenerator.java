package com.vaadin.crm.data.generator;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.vaadin.crm.data.entity.Company;
import com.vaadin.crm.data.entity.Contact;
import com.vaadin.crm.data.entity.Status;
import com.vaadin.crm.data.service.CompanyRepository;
import com.vaadin.crm.data.service.ContactRepository;
import com.vaadin.crm.data.service.StatusRepository;
import com.vaadin.flow.spring.annotation.SpringComponent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.vaadin.artur.exampledata.DataType;
import org.vaadin.artur.exampledata.ExampleDataGenerator;

@SpringComponent
public class DataGenerator {

  @Bean
  public CommandLineRunner loadData(ContactRepository contactRepository, CompanyRepository companyRepository,
      StatusRepository statusRepository) {

    return args -> {
      Logger logger = LoggerFactory.getLogger(getClass());
      if (contactRepository.count() != 0L) {
        logger.info("Using existing database");
        return;
      }
      int seed = 123;

      logger.info("Generating demo data");
      if (companyRepository.count() == 0) {
        var companyGenerator = new ExampleDataGenerator<>(Company.class, LocalDateTime.now());
        companyGenerator.setData(Company::setName, DataType.COMPANY_NAME);
        companyRepository.saveAll(companyGenerator.create(5, seed));
      }

      statusRepository.saveAll(Stream.of("Imported lead", "Not contacted", "Contacted", "Customer", "Closed (lost)")
          .map(Status::new).collect(Collectors.toList()));

      logger.info("... generating 50 Contact entities...");
      var contactGenerator = new ExampleDataGenerator<>(Contact.class, LocalDateTime.now());
      contactGenerator.setData(Contact::setFirstName, DataType.FIRST_NAME);
      contactGenerator.setData(Contact::setLastName, DataType.LAST_NAME);
      contactGenerator.setData(Contact::setEmail, DataType.EMAIL);

      Random r = new Random(seed);
      var companies = companyRepository.findAll();
      var statuses = statusRepository.findAll();
      var contacts = contactGenerator.create(50, seed).stream().map(contact -> {
        contact.setCompany(companies.get(r.nextInt(companies.size())));
        contact.setStatus(statuses.get(r.nextInt(statuses.size())));
        return contact;
      }).collect(Collectors.toList());

      contactRepository.saveAll(contacts);

      logger.info("Generated demo data");
    };
  }

}