package com.metro.metropolitano.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private String paymentMethod;
    private Double amount;
    private LocalDateTime paymentTime;

    @OneToOne
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;
}
