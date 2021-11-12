package com.example.application.data.generator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import com.example.application.data.entity.Company;
import com.example.application.data.entity.Contact;
import com.example.application.data.entity.Status;
import com.example.application.data.repository.CompanyRepository;
import com.example.application.data.repository.ContactRepository;
import com.example.application.data.repository.StatusRepository;
import com.vaadin.exampledata.DataType;
import com.vaadin.exampledata.ExampleDataGenerator;
import com.vaadin.flow.spring.annotation.SpringComponent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.Scheduled;

@SpringComponent
public class DataGenerator {

    private ContactRepository contactRepository;
    private CompanyRepository companyRepository;
    private StatusRepository statusRepository;
    Logger logger = LoggerFactory.getLogger(getClass());

    DataGenerator(ContactRepository contactRepository, CompanyRepository companyRepository,
            StatusRepository statusRepository) {
        this.contactRepository = contactRepository;
        this.companyRepository = companyRepository;
        this.statusRepository = statusRepository;

    }

    @Bean
    public CommandLineRunner loadData() {
        return args -> generateData();
    }

    public void generateData() {

        if (contactRepository.count() != 0L) {
            logger.info("Using existing database");
            return;
        }
        int seed = 123;

        logger.info("Generating demo data");
        ExampleDataGenerator<Company> companyGenerator = new ExampleDataGenerator<>(Company.class,
                LocalDateTime.now());
        companyGenerator.setData(Company::setName, DataType.COMPANY_NAME);
        List<Company> companies = companyRepository.saveAll(companyGenerator.create(5, seed));

        List<Status> statuses = statusRepository
                .saveAll(Stream
                        .of("Imported lead", "Not contacted", "Contacted", "Customer",
                                "Closed (lost)")
                        .map(Status::new).collect(Collectors.toList()));

        logger.info("... generating 50 Contact entities...");
        ExampleDataGenerator<Contact> contactGenerator = new ExampleDataGenerator<>(Contact.class,
                LocalDateTime.now());
        contactGenerator.setData(Contact::setFirstName, DataType.FIRST_NAME);
        contactGenerator.setData(Contact::setLastName, DataType.LAST_NAME);
        contactGenerator.setData(Contact::setEmail, DataType.EMAIL);

        Random r = new Random(seed);
        List<Contact> contacts = contactGenerator.create(50, seed).stream().map(contact -> {
            contact.setCompany(companies.get(r.nextInt(companies.size())));
            contact.setStatus(statuses.get(r.nextInt(statuses.size())));
            return contact;
        }).collect(Collectors.toList());

        contactRepository.saveAll(contacts);

        logger.info("Generated demo data");
    }

    @Scheduled(fixedDelay = 30 * 60 * 60 * 1000)
    public void resetDb() {
        logger.info("*** RESETTING DATABSE ***");
        contactRepository.deleteAll();
        companyRepository.deleteAll();
        statusRepository.deleteAll();

        generateData();
    }

}
