package com.prms.service.student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prms.entity.StudentProfile;
import com.prms.repository.StudentProfileRepository;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Override
    public StudentProfile save(StudentProfile studentProfile) {
        return studentProfileRepository.save(studentProfile);
    }
}

