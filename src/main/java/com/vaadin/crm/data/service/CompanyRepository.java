package com.vaadin.crm.data.service;

import com.vaadin.crm.data.entity.Company;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Integer> {

}
