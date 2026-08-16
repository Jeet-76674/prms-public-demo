package com.prms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PrmsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PrmsBackendApplication.class, args);
	}

}
