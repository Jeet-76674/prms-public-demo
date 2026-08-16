package com.prms.dto.response;

public class VcDashboardStatsResponse {

    private long totalStudents;
    private long totalRecruiters;
    private long pendingRecruiterApprovals;
    private long totalTpos;
    private long totalJobs;
    private long totalPlacements;

    public VcDashboardStatsResponse() {
    }

    public VcDashboardStatsResponse(long totalStudents, long totalRecruiters,
                                   long pendingRecruiterApprovals, long totalTpos,
                                   long totalJobs, long totalPlacements) {
        this.totalStudents = totalStudents;
        this.totalRecruiters = totalRecruiters;
        this.pendingRecruiterApprovals = pendingRecruiterApprovals;
        this.totalTpos = totalTpos;
        this.totalJobs = totalJobs;
        this.totalPlacements = totalPlacements;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalRecruiters() {
        return totalRecruiters;
    }

    public void setTotalRecruiters(long totalRecruiters) {
        this.totalRecruiters = totalRecruiters;
    }

    public long getPendingRecruiterApprovals() {
        return pendingRecruiterApprovals;
    }

    public void setPendingRecruiterApprovals(long pendingRecruiterApprovals) {
        this.pendingRecruiterApprovals = pendingRecruiterApprovals;
    }

    public long getTotalTpos() {
        return totalTpos;
    }

    public void setTotalTpos(long totalTpos) {
        this.totalTpos = totalTpos;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getTotalPlacements() {
        return totalPlacements;
    }

    public void setTotalPlacements(long totalPlacements) {
        this.totalPlacements = totalPlacements;
    }
}
