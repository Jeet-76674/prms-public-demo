package com.prms.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "otp_verifications")
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String otp;

    @Column(nullable = false, length = 30)
    private String purpose;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private Boolean verified = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public OtpVerification() {
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }

	public OtpVerification(Long id, String email, String otp, String purpose, String role, LocalDateTime expiresAt,
			Boolean verified, LocalDateTime createdAt) {
		super();
		this.id = id;
		this.email = email;
		this.otp = otp;
		this.purpose = purpose;
		this.role = role;
		this.expiresAt = expiresAt;
		this.verified = verified;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getOtp() {
		return otp;
	}

	public void setOtp(String otp) {
		this.otp = otp;
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public LocalDateTime getExpiresAt() {
		return expiresAt;
	}

	public void setExpiresAt(LocalDateTime expiresAt) {
		this.expiresAt = expiresAt;
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

    
    

}