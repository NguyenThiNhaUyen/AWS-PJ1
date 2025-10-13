package com.metro.metropolitano.repository;

import com.metro.metropolitano.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment,Long> {

}
