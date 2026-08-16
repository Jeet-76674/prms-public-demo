package com.prms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RecruiterProfileRequest {

    @NotBlank(message = "Company name is required.")
    @Size(max = 150, message = "Company name cannot exceed 150 characters.")
    private String companyName;

    @Email(message = "Invalid company email.")
    @NotBlank(message = "Company email is required.")
    private String companyEmail;

    @NotBlank(message = "Company phone is required.")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Company phone must be 10 digits."
    )
    private String companyPhone;

    @Size(max = 200, message = "Website URL is too long.")
    private String website;

    @Size(max = 100, message = "Industry is too long.")
    private String industry;

    @Size(max = 2000, message = "Company description cannot exceed 2000 characters.")
    private String companyDescription;

    @Size(max = 50, message = "Company size is too long.")
    private String companySize;

    @Size(max = 150, message = "Head office cannot exceed 150 characters.")
    private String headOffice;

    @NotBlank(message = "HR name is required.")
    @Size(max = 100, message = "HR name cannot exceed 100 characters.")
    private String hrName;

    @NotBlank(message = "HR designation is required.")
    @Size(max = 100, message = "HR designation cannot exceed 100 characters.")
    private String hrDesignation;

    @Size(max = 200, message = "LinkedIn URL is too long.")
    private String linkedin;

    public RecruiterProfileRequest() {
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

    
}