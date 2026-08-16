package com.prms.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==========================
    // Recruiter
    // ==========================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private RecruiterProfile recruiter;

    // ==========================
    // Basic Details
    // ==========================

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    // ==========================
    // Employment
    // ==========================

    @Column(nullable = false)
    private String employmentType;

    @Column(nullable = false)
    private String workMode;

    // ==========================
    // Salary
    // ==========================

    @Column(nullable = false)
    private BigDecimal minimumSalary;

    @Column(nullable = false)
    private BigDecimal maximumSalary;

    // ==========================
    // Eligibility
    // ==========================

    @Column(nullable = false)
    private BigDecimal minimumCgpa;

    @Column(nullable = false)
    private Integer allowedBacklogs;

    @Column(nullable = false)
    private Integer experienceRequired;

    @Column(columnDefinition = "TEXT")
    private String requiredSkills;

    // ==========================
    // Vacancy
    // ==========================

    @Column(nullable = false)
    private Integer vacancies;

    // ==========================
    // JD Upload
    // ==========================

    private String jdFileUrl;

    // ==========================
    // Deadline
    // ==========================

    @Column(nullable = false)
    private LocalDate applicationDeadline;

    // ==========================
    // Status
    // ==========================

    @Column(nullable = false)
    private String status;

    // ==========================
    // Audit
    // ==========================

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Job() {
    }

    @PrePersist
    public void prePersist() {

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (status == null) {
            status = "OPEN";
        }

    }

    @PreUpdate
    public void preUpdate() {

        updatedAt = LocalDateTime.now();

    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public RecruiterProfile getRecruiter() {
		return recruiter;
	}

	public void setRecruiter(RecruiterProfile recruiter) {
		this.recruiter = recruiter;
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

	public String getJdFileUrl() {
		return jdFileUrl;
	}

	public void setJdFileUrl(String jdFileUrl) {
		this.jdFileUrl = jdFileUrl;
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

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

    

}