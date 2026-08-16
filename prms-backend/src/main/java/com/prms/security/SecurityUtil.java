package com.prms.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.prms.entity.User;

@Component
public class SecurityUtil {

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException("User not authenticated.");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof CustomUserDetails)) {

            throw new RuntimeException("Invalid authentication.");
        }

        return ((CustomUserDetails) principal).getUser();

    }

}