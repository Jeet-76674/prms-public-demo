package com.prms.dto.request;

import java.util.List;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class ScheduleInterviewRequest {

    @NotEmpty(message = "Please select at least one application to schedule.")
    private List<Long> applicationIds;

    @NotNull(message = "Interview date is required.")
    private String date;

    @NotNull(message = "Interview time is required.")
    private String time;

    private String link;

    private String instructions;

    public ScheduleInterviewRequest() {
    }

    public List<Long> getApplicationIds() {
        return applicationIds;
    }

    public void setApplicationIds(List<Long> applicationIds) {
        this.applicationIds = applicationIds;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}
