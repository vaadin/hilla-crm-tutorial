package com.vaadin.crm.data.service;

import com.vaadin.crm.data.entity.Status;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusRepository extends JpaRepository<Status, Integer> {

}
