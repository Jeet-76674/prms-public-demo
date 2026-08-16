package com.prms.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.prms.entity.User;
import com.prms.repository.UserRepository;
import com.prms.service.demo.DemoDataService;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DemoDataService demoDataService;

    @Override
    public void run(String... args) throws Exception {

        if (demoDataService.isDemoEnabled()) {
            demoDataService.seedBaselineIfEmpty();
            return;
        }

        // Production Initializer: Seed initial VC if missing
        if (userRepository.findByEmail("vc@indus.edu").isEmpty()
                && !userRepository.existsByPhoneNumber("9999999999")) {

            User vcUser = new User();
            vcUser.setFirstName("Vice");
            vcUser.setLastName("Chancellor");
            vcUser.setEmail("vc@indus.edu");
            vcUser.setPhoneNumber("9999999999");
            vcUser.setPassword(passwordEncoder.encode("Password@123"));
            vcUser.setRole("VC");
            vcUser.setAccountStatus("ACTIVE");

            userRepository.save(vcUser);
        }

        // Production Initializer: Seed initial TPO if missing
        if (userRepository.findByEmail("tpo@indus.edu").isEmpty()
                && !userRepository.existsByPhoneNumber("8888888888")) {

            User tpoUser = new User();
            tpoUser.setFirstName("Training");
            tpoUser.setLastName("Placement Officer");
            tpoUser.setEmail("tpo@indus.edu");
            tpoUser.setPhoneNumber("8888888888");
            tpoUser.setPassword(passwordEncoder.encode("Password@123"));
            tpoUser.setRole("TPO");
            tpoUser.setAccountStatus("ACTIVE");

            userRepository.save(tpoUser);
        }

    }

}