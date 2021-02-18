package com.vaadin.crm.data.service;

import com.vaadin.crm.data.entity.Contact;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Integer> {

}
