package com.prms.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class JobRequest {

    @NotBlank(message = "Job title is required.")
    @Size(max = 150)
    private String title;

    @NotBlank(message = "Department is required.")
    private String department;

    @NotBlank(message = "Location is required.")
    private String location;

    @NotBlank(message = "Description is required.")
    private String description;

    @NotBlank(message = "Responsibilities are required.")
    private String responsibilities;

    @NotBlank(message = "Requirements are required.")
    private String requirements;

    @NotBlank(message = "Employment type is required.")
    private String employmentType;

    @NotBlank(message = "Work mode is required.")
    private String workMode;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal minimumSalary;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal maximumSalary;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal minimumCgpa;

    @NotNull
    @Min(0)
    private Integer allowedBacklogs;

    @NotNull
    @Min(0)
    private Integer experienceRequired;

    @NotBlank(message = "Required skills are required.")
    private String requiredSkills;

    @NotNull
    @Min(1)
    private Integer vacancies;

    @NotNull
    @Future(message = "Application deadline must be in the future.")
    private LocalDate applicationDeadline;

    public JobRequest() {
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

	public LocalDate getApplicationDeadline() {
		return applicationDeadline;
	}

	public void setApplicationDeadline(LocalDate applicationDeadline) {
		this.applicationDeadline = applicationDeadline;
	}

}