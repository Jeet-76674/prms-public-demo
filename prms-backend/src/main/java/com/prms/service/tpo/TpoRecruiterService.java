package com.prms.service.tpo;

import java.util.List;
import org.springframework.data.domain.Page;

import com.prms.dto.response.JobResponse;
import com.prms.dto.response.RecruiterProfileResponse;

public interface TpoRecruiterService {

    Page<RecruiterProfileResponse> getAllRecruiters(
            String search,
            String status,
            Boolean verified,
            Integer page,
            Integer size);

    RecruiterProfileResponse getRecruiter(
            Long recruiterId);

    List<JobResponse> getJobsByRecruiterId(Long recruiterId);

}