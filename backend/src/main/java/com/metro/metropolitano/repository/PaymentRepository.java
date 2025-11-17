package com.metro.metropolitano.repository;

import com.metro.metropolitano.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTicket_Id(Long ticketId);
}
