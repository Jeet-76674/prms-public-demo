package com.prms.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "enrollment_number", unique = true, length = 30)
    private String enrollmentNumber;

    @Column(length = 100)
    private String department;

    @Column
    private Integer semester;

    @Column(length = 20)
    private String section;

    @Column(precision = 4, scale = 2)
    private BigDecimal cgpa;

    @Column(name = "passing_year")
    private Integer passingYear;

    @Column(length = 20)
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "address_line_1", length = 255)
    private String addressLine1;

    @Column(name = "address_line_2", length = 255)
    private String addressLine2;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String country;

    @Column(length = 10)
    private String pincode;

    @Column(name = "active_backlogs")
    private Integer activeBacklogs;

    @Column(name = "total_backlogs")
    private Integer totalBacklogs;

    @Column(name = "tenth_percentage", precision = 5, scale = 2)
    private BigDecimal tenthPercentage;

    @Column(name = "twelfth_percentage", precision = 5, scale = 2)
    private BigDecimal twelfthPercentage;

    @Column(name = "diploma_percentage", precision = 5, scale = 2)
    private BigDecimal diplomaPercentage;

    @Column(name = "technical_skills", columnDefinition = "TEXT")
    private String technicalSkills;

    @Column(name = "soft_skills", columnDefinition = "TEXT")
    private String softSkills;

    @Column(columnDefinition = "TEXT")
    private String certifications;

    @Column(columnDefinition = "TEXT")
    private String achievements;
    
    @Column(name = "linkedin_url", length = 255)
    private String linkedinUrl;

    @Column(name = "github_url", length = 255)
    private String githubUrl;

    @Column(name = "portfolio_url", length = 255)
    private String portfolioUrl;

    @Column(name = "leetcode_url", length = 255)
    private String leetcodeUrl;

    @Column(name = "hackerrank_url", length = 255)
    private String hackerrankUrl;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Column(name = "placement_status", length = 30)
    private String placementStatus;

    @Column(name = "preferred_job_location", length = 100)
    private String preferredJobLocation;

    @Column(name = "preferred_job_type", length = 50)
    private String preferredJobType;

    @Column(name = "profile_completed")
    private Boolean profileCompleted = false;

    @Column(name = "resume_uploaded")
    private Boolean resumeUploaded = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;
    
    public StudentProfile() {
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    

	public StudentProfile(Long id, User user, String enrollmentNumber, String department, Integer semester,
			String section, BigDecimal cgpa, Integer passingYear, String gender, LocalDate dateOfBirth,
			String addressLine1, String addressLine2, String city, String state, String country,
			String pincode, Integer activeBacklogs, Integer totalBacklogs, BigDecimal tenthPercentage,
			BigDecimal twelfthPercentage, BigDecimal diplomaPercentage, String technicalSkills, String softSkills,
			String certifications, String achievements, String linkedinUrl, String githubUrl, String portfolioUrl,
			String leetcodeUrl, String hackerrankUrl, String resumeUrl, String placementStatus,
			String preferredJobLocation, String preferredJobType, Boolean profileCompleted, Boolean resumeUploaded,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.id = id;
		this.user = user;
		this.enrollmentNumber = enrollmentNumber;
		this.department = department;
		this.semester = semester;
		this.section = section;
		this.cgpa = cgpa;
		this.passingYear = passingYear;
		this.gender = gender;
		this.dateOfBirth = dateOfBirth;
		this.addressLine1 = addressLine1;
		this.addressLine2 = addressLine2;
		this.city = city;
		this.state = state;
		this.country = country;
		this.pincode = pincode;
		this.activeBacklogs = activeBacklogs;
		this.totalBacklogs = totalBacklogs;
		this.tenthPercentage = tenthPercentage;
		this.twelfthPercentage = twelfthPercentage;
		this.diplomaPercentage = diplomaPercentage;
		this.technicalSkills = technicalSkills;
		this.softSkills = softSkills;
		this.certifications = certifications;
		this.achievements = achievements;
		this.linkedinUrl = linkedinUrl;
		this.githubUrl = githubUrl;
		this.portfolioUrl = portfolioUrl;
		this.leetcodeUrl = leetcodeUrl;
		this.hackerrankUrl = hackerrankUrl;
		this.resumeUrl = resumeUrl;
		this.placementStatus = placementStatus;
		this.preferredJobLocation = preferredJobLocation;
		this.preferredJobType = preferredJobType;
		this.profileCompleted = profileCompleted;
		this.resumeUploaded = resumeUploaded;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
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

	public String getEnrollmentNumber() {
		return enrollmentNumber;
	}

	public void setEnrollmentNumber(String enrollmentNumber) {
		this.enrollmentNumber = enrollmentNumber;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public Integer getSemester() {
		return semester;
	}

	public void setSemester(Integer semester) {
		this.semester = semester;
	}

	public String getSection() {
		return section;
	}

	public void setSection(String section) {
		this.section = section;
	}

	public BigDecimal getCgpa() {
		return cgpa;
	}

	public void setCgpa(BigDecimal cgpa) {
		this.cgpa = cgpa;
	}

	public Integer getPassingYear() {
		return passingYear;
	}

	public void setPassingYear(Integer passingYear) {
		this.passingYear = passingYear;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getAddressLine1() {
		return addressLine1;
	}

	public void setAddressLine1(String addressLine1) {
		this.addressLine1 = addressLine1;
	}

	public String getAddressLine2() {
		return addressLine2;
	}

	public void setAddressLine2(String addressLine2) {
		this.addressLine2 = addressLine2;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getPincode() {
		return pincode;
	}

	public void setPincode(String pincode) {
		this.pincode = pincode;
	}

	public Integer getActiveBacklogs() {
		return activeBacklogs;
	}

	public void setActiveBacklogs(Integer activeBacklogs) {
		this.activeBacklogs = activeBacklogs;
	}

	public Integer getTotalBacklogs() {
		return totalBacklogs;
	}

	public void setTotalBacklogs(Integer totalBacklogs) {
		this.totalBacklogs = totalBacklogs;
	}

	public BigDecimal getTenthPercentage() {
		return tenthPercentage;
	}

	public void setTenthPercentage(BigDecimal tenthPercentage) {
		this.tenthPercentage = tenthPercentage;
	}

	public BigDecimal getTwelfthPercentage() {
		return twelfthPercentage;
	}

	public void setTwelfthPercentage(BigDecimal twelfthPercentage) {
		this.twelfthPercentage = twelfthPercentage;
	}

	public BigDecimal getDiplomaPercentage() {
		return diplomaPercentage;
	}

	public void setDiplomaPercentage(BigDecimal diplomaPercentage) {
		this.diplomaPercentage = diplomaPercentage;
	}

	public String getTechnicalSkills() {
		return technicalSkills;
	}

	public void setTechnicalSkills(String technicalSkills) {
		this.technicalSkills = technicalSkills;
	}

	public String getSoftSkills() {
		return softSkills;
	}

	public void setSoftSkills(String softSkills) {
		this.softSkills = softSkills;
	}

	public String getCertifications() {
		return certifications;
	}

	public void setCertifications(String certifications) {
		this.certifications = certifications;
	}

	public String getAchievements() {
		return achievements;
	}

	public void setAchievements(String achievements) {
		this.achievements = achievements;
	}

	public String getLinkedinUrl() {
		return linkedinUrl;
	}

	public void setLinkedinUrl(String linkedinUrl) {
		this.linkedinUrl = linkedinUrl;
	}

	public String getGithubUrl() {
		return githubUrl;
	}

	public void setGithubUrl(String githubUrl) {
		this.githubUrl = githubUrl;
	}

	public String getPortfolioUrl() {
		return portfolioUrl;
	}

	public void setPortfolioUrl(String portfolioUrl) {
		this.portfolioUrl = portfolioUrl;
	}

	public String getLeetcodeUrl() {
		return leetcodeUrl;
	}

	public void setLeetcodeUrl(String leetcodeUrl) {
		this.leetcodeUrl = leetcodeUrl;
	}

	public String getHackerrankUrl() {
		return hackerrankUrl;
	}

	public void setHackerrankUrl(String hackerrankUrl) {
		this.hackerrankUrl = hackerrankUrl;
	}

	public String getResumeUrl() {
		return resumeUrl;
	}

	public void setResumeUrl(String resumeUrl) {
		this.resumeUrl = resumeUrl;
	}

	public String getPlacementStatus() {
		return placementStatus;
	}

	public void setPlacementStatus(String placementStatus) {
		this.placementStatus = placementStatus;
	}

	public String getPreferredJobLocation() {
		return preferredJobLocation;
	}

	public void setPreferredJobLocation(String preferredJobLocation) {
		this.preferredJobLocation = preferredJobLocation;
	}

	public String getPreferredJobType() {
		return preferredJobType;
	}

	public void setPreferredJobType(String preferredJobType) {
		this.preferredJobType = preferredJobType;
	}

	public Boolean getProfileCompleted() {
		return profileCompleted;
	}

	public void setProfileCompleted(Boolean profileCompleted) {
		this.profileCompleted = profileCompleted;
	}
	
	public String getProfileImageUrl() {
	    return profileImageUrl;
	}

	public void setProfileImageUrl(String profileImageUrl) {
	    this.profileImageUrl = profileImageUrl;
	}

	public Boolean getResumeUploaded() {
		return resumeUploaded;
	}

	public void setResumeUploaded(Boolean resumeUploaded) {
		this.resumeUploaded = resumeUploaded;
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
    
    