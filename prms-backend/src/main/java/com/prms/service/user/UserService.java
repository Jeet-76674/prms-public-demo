package com.prms.service.user;

import java.util.Optional;

import com.prms.entity.User;

public interface UserService {

    User save(User user);

    Optional<User> findByEmail(String email);

    Optional<User> findById(Long id);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

}