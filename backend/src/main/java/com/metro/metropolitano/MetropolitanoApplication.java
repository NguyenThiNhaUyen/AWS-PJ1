package com.metro.metropolitano;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MetropolitanoApplication {

	public static void main(String[] args) {
		SpringApplication.run(MetropolitanoApplication.class, args);
	}

}
