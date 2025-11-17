package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.PurchaseRequestDTO;
import com.metro.metropolitano.model.Payment;
import com.metro.metropolitano.model.Ticket;
import com.metro.metropolitano.service.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final VNPayService vnPayService;
    private final PaymentService paymentService;
    private final PaymentOrchestratorService paymentOrchestratorService;

    @PostMapping("/vnpay/create")
    public ResponseEntity<Map<String, Object>> create(
            @RequestBody PurchaseRequestDTO request,
            HttpServletRequest httpReq
    ) {
        String clientIp = httpReq.getRemoteAddr();
        Map<String, Object> result = paymentOrchestratorService.createPayment(request, clientIp);
        return ResponseEntity.ok(result);
    }


    /**
     * Callback từ VNPay trả về sau khi thanh toán
     * (returnUrl trong VNPay secret/properties)
     */
    @GetMapping("/vnpay/return")
    public ResponseEntity<Map<String,Object>> returned(@RequestParam Map<String,String> all) {
        boolean sigOk   = vnPayService.verifySignature(all);
        String code     = all.getOrDefault("vnp_ResponseCode", "99");
        String orderStr = all.getOrDefault("vnp_TxnRef", "");

        Long ticketId   = orderStr.isBlank() ? null : Long.parseLong(orderStr);

        boolean paid = sigOk && "00".equals(code);
        if (ticketId != null) {
            if (paid) paymentService.markPaid(ticketId);
            else      paymentService.markFailed(ticketId);
        }

        return ResponseEntity.ok(Map.of(
                "signatureValid", sigOk,
                "paid", paid,
                "responseCode", code,
                "ticketId", ticketId,
                "payload", all
        ));
    }
}
