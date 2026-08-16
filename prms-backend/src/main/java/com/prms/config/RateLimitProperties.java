package com.prms.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.rate-limit")
public class RateLimitProperties {

    private boolean enabled = true;
    private int loginPerMinute = 5;
    private int signupPer10Minutes = 3;
    private int otpPerHour = 3;
    private int resumeUploadPerHour = 5;
    private int jdUploadPerHour = 5;
    private int demoResetPerHour = 5;
    private int authPerMinute = 120;
    private int unauthPerMinute = 60;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getLoginPerMinute() {
        return loginPerMinute;
    }

    public void setLoginPerMinute(int loginPerMinute) {
        this.loginPerMinute = loginPerMinute;
    }

    public int getSignupPer10Minutes() {
        return signupPer10Minutes;
    }

    public void setSignupPer10Minutes(int signupPer10Minutes) {
        this.signupPer10Minutes = signupPer10Minutes;
    }

    public int getOtpPerHour() {
        return otpPerHour;
    }

    public void setOtpPerHour(int otpPerHour) {
        this.otpPerHour = otpPerHour;
    }

    public int getResumeUploadPerHour() {
        return resumeUploadPerHour;
    }

    public void setResumeUploadPerHour(int resumeUploadPerHour) {
        this.resumeUploadPerHour = resumeUploadPerHour;
    }

    public int getJdUploadPerHour() {
        return jdUploadPerHour;
    }

    public void setJdUploadPerHour(int jdUploadPerHour) {
        this.jdUploadPerHour = jdUploadPerHour;
    }

    public int getDemoResetPerHour() {
        return demoResetPerHour;
    }

    public void setDemoResetPerHour(int demoResetPerHour) {
        this.demoResetPerHour = demoResetPerHour;
    }

    public int getAuthPerMinute() {
        return authPerMinute;
    }

    public void setAuthPerMinute(int authPerMinute) {
        this.authPerMinute = authPerMinute;
    }

    public int getUnauthPerMinute() {
        return unauthPerMinute;
    }

    public void setUnauthPerMinute(int unauthPerMinute) {
        this.unauthPerMinute = unauthPerMinute;
    }
}
