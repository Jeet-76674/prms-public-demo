package com.prms.service.demo;

import java.util.Map;

public interface DemoDataService {

    /**
     * Seeds the baseline fictional demo dataset if not already present.
     */
    void seedBaselineIfEmpty();

    /**
     * Completely resets the demo database state back to the predefined baseline.
     */
    void resetToBaseline();

    /**
     * Returns true if demo mode is enabled in the configuration.
     */
    boolean isDemoEnabled();

    /**
     * Returns a map of standard fictional demo accounts for UI convenience.
     */
    Map<String, Object> getDemoAccountsInfo();

}
