package com.apnabank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BakingbackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BakingbackendApplication.class, args);
	}

}
