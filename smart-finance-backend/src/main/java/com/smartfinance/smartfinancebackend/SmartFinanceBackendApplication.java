package com.smartfinance.smartfinancebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartFinanceBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartFinanceBackendApplication.class, args);
    }

}
