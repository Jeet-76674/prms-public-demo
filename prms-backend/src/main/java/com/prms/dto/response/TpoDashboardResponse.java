package com.prms.dto.response;

public class TpoDashboardResponse {

    private Long totalStudents;

    private Long totalRecruiters;

    private Long totalJobs;

    private Long activeJobs;

    private Long totalApplications;

    private Long placedStudents;

    private Long pendingApplications;

    private Long activeRecruiters;
    private Long pendingRecruiters;
    private Long rejectedRecruiters;
    private Long inactiveRecruiters;
    private Long closedJobs;

    public TpoDashboardResponse() {

    }

    public TpoDashboardResponse(Long totalStudents, Long totalRecruiters, Long totalJobs, Long activeJobs,
            Long totalApplications, Long placedStudents, Long pendingApplications, Long activeRecruiters,
            Long pendingRecruiters, Long rejectedRecruiters, Long inactiveRecruiters, Long closedJobs) {

        this.totalStudents = totalStudents;
        this.totalRecruiters = totalRecruiters;
        this.totalJobs = totalJobs;
        this.activeJobs = activeJobs;
        this.totalApplications = totalApplications;
        this.placedStudents = placedStudents;
        this.pendingApplications = pendingApplications;
        this.activeRecruiters = activeRecruiters;
        this.pendingRecruiters = pendingRecruiters;
        this.rejectedRecruiters = rejectedRecruiters;
        this.inactiveRecruiters = inactiveRecruiters;
        this.closedJobs = closedJobs;
    }

    public Long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public Long getTotalRecruiters() {
        return totalRecruiters;
    }

    public void setTotalRecruiters(Long totalRecruiters) {
        this.totalRecruiters = totalRecruiters;
    }

    public Long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(Long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public Long getActiveJobs() {
        return activeJobs;
    }

    public void setActiveJobs(Long activeJobs) {
        this.activeJobs = activeJobs;
    }

    public Long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(Long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public Long getPlacedStudents() {
        return placedStudents;
    }

    public void setPlacedStudents(Long placedStudents) {
        this.placedStudents = placedStudents;
    }

    public Long getPendingApplications() {
        return pendingApplications;
    }

    public void setPendingApplications(Long pendingApplications) {
        this.pendingApplications = pendingApplications;
    }

    public Long getActiveRecruiters() {
        return activeRecruiters;
    }

    public void setActiveRecruiters(Long activeRecruiters) {
        this.activeRecruiters = activeRecruiters;
    }

    public Long getPendingRecruiters() {
        return pendingRecruiters;
    }

    public void setPendingRecruiters(Long pendingRecruiters) {
        this.pendingRecruiters = pendingRecruiters;
    }

    public Long getRejectedRecruiters() {
        return rejectedRecruiters;
    }

    public void setRejectedRecruiters(Long rejectedRecruiters) {
        this.rejectedRecruiters = rejectedRecruiters;
    }

    public Long getInactiveRecruiters() {
        return inactiveRecruiters;
    }

    public void setInactiveRecruiters(Long inactiveRecruiters) {
        this.inactiveRecruiters = inactiveRecruiters;
    }

    public Long getClosedJobs() {
        return closedJobs;
    }

    public void setClosedJobs(Long closedJobs) {
        this.closedJobs = closedJobs;
    }
}