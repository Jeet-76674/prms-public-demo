package com.prms.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "recruiter_profiles")
public class RecruiterProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false, unique = true)
    private String companyEmail;

    @Column(nullable = false, unique = true)
    private String companyPhone;

    private String website;

    private String industry;

    @Column(length = 2000)
    private String companyDescription;

    private String companySize;

    private String headOffice;

    private String hrName;

    private String hrDesignation;

    private String linkedin;

    @Column(length = 500)
    private String logoUrl;

    private Boolean verified = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public RecruiterProfile() {
    }

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (verified == null) {
            verified = false;
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

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getCompanyEmail() {
		return companyEmail;
	}

	public void setCompanyEmail(String companyEmail) {
		this.companyEmail = companyEmail;
	}

	public String getCompanyPhone() {
		return companyPhone;
	}

	public void setCompanyPhone(String companyPhone) {
		this.companyPhone = companyPhone;
	}

	public String getWebsite() {
		return website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public String getIndustry() {
		return industry;
	}

	public void setIndustry(String industry) {
		this.industry = industry;
	}

	public String getCompanyDescription() {
		return companyDescription;
	}

	public void setCompanyDescription(String companyDescription) {
		this.companyDescription = companyDescription;
	}

	public String getCompanySize() {
		return companySize;
	}

	public void setCompanySize(String companySize) {
		this.companySize = companySize;
	}

	public String getHeadOffice() {
		return headOffice;
	}

	public void setHeadOffice(String headOffice) {
		this.headOffice = headOffice;
	}

	public String getHrName() {
		return hrName;
	}

	public void setHrName(String hrName) {
		this.hrName = hrName;
	}

	public String getHrDesignation() {
		return hrDesignation;
	}

	public void setHrDesignation(String hrDesignation) {
		this.hrDesignation = hrDesignation;
	}

	public String getLinkedin() {
		return linkedin;
	}

	public void setLinkedin(String linkedin) {
		this.linkedin = linkedin;
	}

	public String getLogoUrl() {
		return logoUrl;
	}

	public void setLogoUrl(String logoUrl) {
		this.logoUrl = logoUrl;
	}

	public Boolean getVerified() {
		return verified;
	}

	public void setVerified(Boolean verified) {
		this.verified = verified;
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

	public RecruiterProfile(Long id, User user, String companyName, String companyEmail, String companyPhone,
			String website, String industry, String companyDescription, String companySize, String headOffice,
			String hrName, String hrDesignation, String linkedin, String logoUrl, Boolean verified,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.id = id;
		this.user = user;
		this.companyName = companyName;
		this.companyEmail = companyEmail;
		this.companyPhone = companyPhone;
		this.website = website;
		this.industry = industry;
		this.companyDescription = companyDescription;
		this.companySize = companySize;
		this.headOffice = headOffice;
		this.hrName = hrName;
		this.hrDesignation = hrDesignation;
		this.linkedin = linkedin;
		this.logoUrl = logoUrl;
		this.verified = verified;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

    
   
}