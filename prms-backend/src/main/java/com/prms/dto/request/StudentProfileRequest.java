package com.prms.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class StudentProfileRequest {

    @NotBlank(message = "Enrollment number is required.")
    private String enrollmentNumber;

    @NotBlank(message = "Department is required.")
    private String department;

    @NotNull(message = "Semester is required.")
    @Min(value = 1, message = "Semester must be between 1 and 8.")
    @Max(value = 8, message = "Semester must be between 1 and 8.")
    private Integer semester;

    @NotBlank(message = "Section is required.")
    private String section;

    @NotNull(message = "CGPA is required.")
    @DecimalMin(value = "0.00", message = "CGPA cannot be less than 0.")
    @DecimalMax(value = "10.00", message = "CGPA cannot exceed 10.")
    private BigDecimal cgpa;

    @NotNull(message = "Passing year is required.")
    private Integer passingYear;

    @NotBlank(message = "Gender is required.")
    private String gender;

    @NotNull(message = "Date of birth is required.")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Address Line 1 is required.")
    private String addressLine1;

    private String addressLine2;

    @NotBlank(message = "City is required.")
    private String city;

    @NotBlank(message = "State is required.")
    private String state;

    @NotBlank(message = "Country is required.")
    private String country;

    @Pattern(regexp = "^[0-9]{6}$", message = "Invalid pincode.")
    private String pincode;

    private Integer activeBacklogs;

    private Integer totalBacklogs;

    private BigDecimal tenthPercentage;

    private BigDecimal twelfthPercentage;

    private BigDecimal diplomaPercentage;

    private String technicalSkills;

    private String softSkills;

    private String certifications;

    private String achievements;

    private String linkedinUrl;

    private String githubUrl;

    private String portfolioUrl;

    private String leetcodeUrl;

    private String hackerrankUrl;

    private String preferredJobLocation;

    private String preferredJobType;


    public StudentProfileRequest() {
    }


	public StudentProfileRequest(@NotBlank(message = "Enrollment number is required.") String enrollmentNumber,
			@NotBlank(message = "Department is required.") String department,
			@NotNull(message = "Semester is required.") @Min(value = 1, message = "Semester must be between 1 and 8.") @Max(value = 8, message = "Semester must be between 1 and 8.") Integer semester,
			@NotBlank(message = "Section is required.") String section,
			@NotNull(message = "CGPA is required.") @DecimalMin(value = "0.00", message = "CGPA cannot be less than 0.") @DecimalMax(value = "10.00", message = "CGPA cannot exceed 10.") BigDecimal cgpa,
			@NotNull(message = "Passing year is required.") Integer passingYear,
			@NotBlank(message = "Gender is required.") String gender,
			@NotNull(message = "Date of birth is required.") LocalDate dateOfBirth,
			@NotBlank(message = "Address Line 1 is required.") String addressLine1, String addressLine2,
			@NotBlank(message = "City is required.") String city,
			@NotBlank(message = "State is required.") String state,
			@NotBlank(message = "Country is required.") String country,
			@Pattern(regexp = "^[0-9]{6}$", message = "Invalid pincode.") String pincode, Integer activeBacklogs,
			Integer totalBacklogs, BigDecimal tenthPercentage, BigDecimal twelfthPercentage,
			BigDecimal diplomaPercentage, String technicalSkills, String softSkills, String certifications,
			String achievements, String linkedinUrl, String githubUrl, String portfolioUrl, String leetcodeUrl,
			String hackerrankUrl, String preferredJobLocation, String preferredJobType) {
		super();
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
		this.preferredJobLocation = preferredJobLocation;
		this.preferredJobType = preferredJobType;
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

    
}