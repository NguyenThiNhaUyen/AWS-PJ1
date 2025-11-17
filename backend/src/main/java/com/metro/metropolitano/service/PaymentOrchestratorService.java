package com.metro.metropolitano.service;

import com.metro.metropolitano.dto.PurchaseRequestDTO;
import com.metro.metropolitano.model.Payment;
import com.metro.metropolitano.model.Ticket;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentOrchestratorService {

    private final FareService fareService;
    private final TicketService ticketService;
    private final PaymentService paymentService; // của bạn
    private final VNPayService vnPayService;

    /** Nhận PurchaseRequestDTO → tạo Ticket → Payment → tạo URL VNPay */
    @Transactional
    public Map<String, Object> createPayment(PurchaseRequestDTO request, String clientIp) {

        // 1. Tính giá vé
        double fare = fareService.calculateFare(
                request.getStartStation(),
                request.getEndStation()
        );

        Ticket ticket = ticketService.createTicket(request, fare);

        // 3. Tạo Payment pending (dùng service sẵn có của bạn)
        Payment payment = paymentService.createOrUpdatePending(ticket, fare);

        // 4. Tạo URL VNPay
        String payUrl = vnPayService.createPaymentUrl(payment, clientIp);

        // 5. Trả lại FE
        return Map.of(
                "ticketId", ticket.getId(),
                "amount", fare,
                "payUrl", payUrl
        );
    }
}

