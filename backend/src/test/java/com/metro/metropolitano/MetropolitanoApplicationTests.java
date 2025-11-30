package com.metro.metropolitano;

import com.metro.metropolitano.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
class MetropolitanoApplicationTests {

    @MockBean
    private EmailService emailService;

	@Test
	void contextLoads() {
	}

}
