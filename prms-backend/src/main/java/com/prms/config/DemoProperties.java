package com.prms.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.demo")
public class DemoProperties {

    private boolean enabled = true;
    private int autoResetMinutes = 0;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getAutoResetMinutes() {
        return autoResetMinutes;
    }

    public void setAutoResetMinutes(int autoResetMinutes) {
        this.autoResetMinutes = autoResetMinutes;
    }
}
