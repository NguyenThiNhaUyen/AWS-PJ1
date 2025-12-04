package com.metro.metropolitano.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.metro.metropolitano.dto.PurchaseRequestDTO;
import com.metro.metropolitano.service.PaymentOrchestratorService;
import com.metro.metropolitano.service.PaymentService;
import com.metro.metropolitano.service.VNPayService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

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
    public RedirectView returned(@RequestParam Map<String,String> all) {
        boolean sigOk   = vnPayService.verifySignature(all);
        String code     = all.getOrDefault("vnp_ResponseCode", "99");
        String orderStr = all.getOrDefault("vnp_TxnRef", "");

        Long ticketId   = orderStr.isBlank() ? null : Long.parseLong(orderStr);

        boolean paid = sigOk && "00".equals(code);
        if (ticketId != null) {
            if (paid) paymentService.markPaid(ticketId);
            else      paymentService.markFailed(ticketId);
        }

        // Redirect to frontend with full URL
        String frontendUrl = "http://localhost:3000";
        RedirectView redirectView = new RedirectView();
        if (paid) {
            redirectView.setUrl(frontendUrl + "/payment-success?ticketId=" + ticketId + "&vnp_ResponseCode=" + code);
        } else {
            redirectView.setUrl(frontendUrl + "/payment-failed?ticketId=" + ticketId + "&vnp_ResponseCode=" + code);
        }
        return redirectView;
    }
}
