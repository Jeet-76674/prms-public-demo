package com.prms.service.file;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String uploadResume(MultipartFile file);

    String uploadProfileImage(MultipartFile file);
    
    String uploadCompanyLogo(MultipartFile file);
    
    String uploadJobDescription(MultipartFile file);

}