package com.prms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prms.entity.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByCompanyName(String companyName);

    boolean existsByCompanyName(String companyName);

}