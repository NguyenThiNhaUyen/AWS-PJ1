package com.metro.metropolitano.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // VNPay transaction reference (vnp_TxnRef)
    @Column(name = "vnpay_txn_ref")
    private String vnpayTxnRef;

    // Payment method: VNPay, CASH, MOMO...
    private String paymentMethod;

    // Success, Pending, Failed
    private String status;

    private Double amount;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // Time returned by VNPay (optional)
    private LocalDateTime paymentTime;

    @OneToOne
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;
}
