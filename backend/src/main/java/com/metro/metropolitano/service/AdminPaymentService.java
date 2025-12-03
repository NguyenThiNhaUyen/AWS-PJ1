package com.metro.metropolitano.service;

import com.metro.metropolitano.dto.AdminPaymentDTO;
import com.metro.metropolitano.model.Payment;
import com.metro.metropolitano.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminPaymentService {
    private final PaymentRepository paymentRepository;

    public Page<AdminPaymentDTO> getAll(String status, int page, int size) {

        Page<Payment> payments = paymentRepository.filter(
                status == null ? null : status.trim(),
                PageRequest.of(page, size, Sort.by("id").descending())
        );

        return payments.map(p -> AdminPaymentDTO.builder()
                .id(p.getId())
                .transactionId(p.getVnpayTxnRef())
                .ticketId(p.getTicket().getId())
                .username(p.getTicket().getAccount().getUsername())
                .amount(p.getAmount())
                .method("VNPay")
                .status(p.getStatus())
                .timestamp(p.getCreatedAt())
                .build()
        );
    }

    public AdminPaymentDTO getOne(Long id) {
        Payment p = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return AdminPaymentDTO.builder()
                .id(p.getId())
                .transactionId(p.getVnpayTxnRef())
                .ticketId(p.getTicket().getId())
                .username(p.getTicket().getAccount().getUsername())
                .amount(p.getAmount())
                .method("VNPay")
                .status(p.getStatus())
                .timestamp(p.getCreatedAt())
                .build();
    }
}
