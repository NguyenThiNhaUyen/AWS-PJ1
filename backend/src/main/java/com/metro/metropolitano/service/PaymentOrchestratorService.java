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

    @Transactional
    public Map<String, Object> createPayment(PurchaseRequestDTO request, String clientIp) {

        double fare;

        // ====== Xác định loại vé ======
        switch (request.getTicketTypeName()) {

            case "Ve tuyen":  // Vé lượt
                if (request.getStartStation() == null || request.getEndStation() == null) {
                    throw new RuntimeException("Start and end station required for SINGLE ticket");
                }
                fare = fareService.calculateFare(
                        request.getStartStation(),
                        request.getEndStation()
                );
                break;

            case "Ve 1 ngay": // Vé ngày không cần station
                fare = 30000; // bạn tự đặt giá
                break;

            case "Ve 3 ngay": // Vé 3 ngày
                fare = 75000; // bạn tự đặt giá
                break;

            default:
                throw new RuntimeException("Invalid ticket type: " + request.getTicketTypeName());
        }

        // ====== Tạo Ticket ======
        Ticket ticket = ticketService.createTicket(request, fare);

        // ====== Tạo Payment ======
        Payment payment = paymentService.createOrUpdatePending(ticket, fare);

        // ====== Tạo URL VNPay ======
        String payUrl = vnPayService.createPaymentUrl(payment, clientIp);

        // ====== Trả lại FE ======
        return Map.of(
                "ticketId", ticket.getId(),
                "amount", fare,
                "payUrl", payUrl
        );
    }
}

