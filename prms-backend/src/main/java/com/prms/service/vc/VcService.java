package com.prms.service.vc;

import java.util.List;
import org.springframework.data.domain.Page;

import com.prms.dto.request.CreateTpoRequest;
import com.prms.dto.request.ResetTpoPasswordRequest;
import com.prms.dto.request.UpdateRecruiterAccountStatusRequest;
import com.prms.dto.request.UpdateTpoStatusRequest;
import com.prms.dto.response.JobResponse;
import com.prms.dto.response.RecruiterProfileResponse;
import com.prms.dto.response.TpoUserResponse;
import com.prms.dto.response.VcDashboardStatsResponse;

public interface VcService {

    VcDashboardStatsResponse getDashboardStats();

    Page<RecruiterProfileResponse> getAllRecruiters(
            String search,
            String status,
            Boolean verified,
            Integer page,
            Integer size);

    RecruiterProfileResponse getRecruiter(Long recruiterId);

    RecruiterProfileResponse approveRecruiter(Long recruiterId);

    RecruiterProfileResponse rejectRecruiter(Long recruiterId);

    RecruiterProfileResponse updateRecruiterAccountStatus(
            Long recruiterId,
            UpdateRecruiterAccountStatusRequest request);

    List<JobResponse> getJobsByRecruiterId(Long recruiterId);

    List<TpoUserResponse> getAllTpos();

    TpoUserResponse getTpoById(Long id);

    TpoUserResponse createTpo(CreateTpoRequest request);

    TpoUserResponse updateTpoStatus(Long id, UpdateTpoStatusRequest request);

    void resetTpoPassword(Long id, ResetTpoPasswordRequest request);
}
