package com.prms.service.tpo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prms.dto.response.TpoDashboardResponse;
import com.prms.repository.JobApplicationRepository;
import com.prms.repository.JobRepository;
import com.prms.repository.RecruiterProfileRepository;
import com.prms.repository.StudentProfileRepository;
import com.prms.service.tpo.TpoDashboardService;
import com.prms.repository.UserRepository;

@Service
public class TpoDashboardServiceImpl implements TpoDashboardService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private RecruiterProfileRepository recruiterRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public TpoDashboardResponse getDashboard() {

        Long totalStudents = studentProfileRepository.count();

        Long totalRecruiters = recruiterRepository.count();

        Long totalJobs = jobRepository.count();

        Long activeJobs = jobRepository.countByStatus("OPEN"); // Note: Using "OPEN" instead of "ACTIVE" as it matches the frontend

        Long totalApplications = jobApplicationRepository.count();

        Long placedStudents =
                studentProfileRepository.countByPlacementStatus("PLACED");

        Long pendingApplications =
                jobApplicationRepository.countByApplicationStatus("PENDING");

        Long activeRecruiters = userRepository.countByRoleAndAccountStatus("RECRUITER", "ACTIVE");
        Long pendingRecruiters = userRepository.countByRoleAndAccountStatus("RECRUITER", "PENDING");
        Long rejectedRecruiters = userRepository.countByRoleAndAccountStatus("RECRUITER", "REJECTED");
        Long inactiveRecruiters = userRepository.countByRoleAndAccountStatus("RECRUITER", "INACTIVE");
        
        Long closedJobs = jobRepository.countByStatus("CLOSED");

        return new TpoDashboardResponse(

                totalStudents,

                totalRecruiters,

                totalJobs,

                activeJobs,

                totalApplications,

                placedStudents,

                pendingApplications,
                
                activeRecruiters,
                
                pendingRecruiters,
                
                rejectedRecruiters,
                
                inactiveRecruiters,
                
                closedJobs

        );

    }

}