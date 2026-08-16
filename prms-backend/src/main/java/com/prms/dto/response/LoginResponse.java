package com.prms.dto.response;

public class LoginResponse {

    private boolean success;
    private String message;
    private String token;
    private String role;
    private boolean firstLogin;
    private boolean profileCompleted;

    public LoginResponse() {
    }

    public LoginResponse(boolean success,
                         String message,
                         String token,
                         String role,
                         boolean firstLogin,
                         boolean profileCompleted) {

        this.success = success;
        this.message = message;
        this.token = token;
        this.role = role;
        this.firstLogin = firstLogin;
        this.profileCompleted = profileCompleted;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isFirstLogin() {
        return firstLogin;
    }

    public void setFirstLogin(boolean firstLogin) {
        this.firstLogin = firstLogin;
    }

    public boolean isProfileCompleted() {
        return profileCompleted;
    }

    public void setProfileCompleted(boolean profileCompleted) {
        this.profileCompleted = profileCompleted;
    }

}