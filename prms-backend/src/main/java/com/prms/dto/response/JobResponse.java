package com.prms.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public class JobResponse {

    private Long id;

    private String title;

    private String department;

    private String location;

    private String description;

    private String responsibilities;

    private String requirements;

    private String employmentType;

    private String workMode;

    private BigDecimal minimumSalary;

    private BigDecimal maximumSalary;

    private BigDecimal minimumCgpa;

    private Integer allowedBacklogs;

    private Integer experienceRequired;

    private String requiredSkills;

    private Integer vacancies;

    private String jdUrl;
    private String companyName;
    private String companyLogo;

    private LocalDate applicationDeadline;

    private String status;

    public JobResponse() {
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getResponsibilities() {
		return responsibilities;
	}

	public void setResponsibilities(String responsibilities) {
		this.responsibilities = responsibilities;
	}

	public String getRequirements() {
		return requirements;
	}

	public void setRequirements(String requirements) {
		this.requirements = requirements;
	}

	public String getEmploymentType() {
		return employmentType;
	}

	public void setEmploymentType(String employmentType) {
		this.employmentType = employmentType;
	}

	public String getWorkMode() {
		return workMode;
	}

	public void setWorkMode(String workMode) {
		this.workMode = workMode;
	}

	public BigDecimal getMinimumSalary() {
		return minimumSalary;
	}

	public void setMinimumSalary(BigDecimal minimumSalary) {
		this.minimumSalary = minimumSalary;
	}

	public BigDecimal getMaximumSalary() {
		return maximumSalary;
	}

	public void setMaximumSalary(BigDecimal maximumSalary) {
		this.maximumSalary = maximumSalary;
	}

	public BigDecimal getMinimumCgpa() {
		return minimumCgpa;
	}

	public void setMinimumCgpa(BigDecimal minimumCgpa) {
		this.minimumCgpa = minimumCgpa;
	}

	public Integer getAllowedBacklogs() {
		return allowedBacklogs;
	}

	public void setAllowedBacklogs(Integer allowedBacklogs) {
		this.allowedBacklogs = allowedBacklogs;
	}

	public Integer getExperienceRequired() {
		return experienceRequired;
	}

	public void setExperienceRequired(Integer experienceRequired) {
		this.experienceRequired = experienceRequired;
	}

	public String getRequiredSkills() {
		return requiredSkills;
	}

	public void setRequiredSkills(String requiredSkills) {
		this.requiredSkills = requiredSkills;
	}

	public Integer getVacancies() {
		return vacancies;
	}

	public void setVacancies(Integer vacancies) {
		this.vacancies = vacancies;
	}

	public String getJdUrl() {
		return jdUrl;
	}

	public void setJdUrl(String jdUrl) {
		this.jdUrl = jdUrl;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getCompanyLogo() {
		return companyLogo;
	}

	public void setCompanyLogo(String companyLogo) {
		this.companyLogo = companyLogo;
	}

	public LocalDate getApplicationDeadline() {
		return applicationDeadline;
	}

	public void setApplicationDeadline(LocalDate applicationDeadline) {
		this.applicationDeadline = applicationDeadline;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

    
}