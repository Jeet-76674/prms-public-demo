package com.prms.service.recruiter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prms.entity.RecruiterProfile;
import com.prms.entity.User;
import com.prms.repository.RecruiterProfileRepository;

@Service
public class RecruiterApprovalServiceImpl implements RecruiterApprovalService {

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Override
    public void checkRecruiterApproved(User user) {
        RecruiterProfile profile = recruiterProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Recruiter profile not found."));

        if (!Boolean.TRUE.equals(profile.getVerified())) {
            throw new RuntimeException("Your account is waiting for Vice Chancellor (VC) approval.");
        }
    }

}
