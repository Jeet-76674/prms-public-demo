package com.prms.service.recruiter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prms.entity.RecruiterProfile;
import com.prms.repository.RecruiterProfileRepository;

@Service
public class RecruiterServiceImpl implements RecruiterService {

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Override
    public RecruiterProfile save(RecruiterProfile recruiterProfile) {
        return recruiterProfileRepository.save(recruiterProfile);
    }

}