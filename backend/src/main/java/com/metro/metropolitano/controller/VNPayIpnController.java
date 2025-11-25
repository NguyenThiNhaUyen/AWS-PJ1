package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.VnpIpnResponse;
import com.metro.metropolitano.service.PaymentService;
import com.metro.metropolitano.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments/vnpay")
@RequiredArgsConstructor
public class VNPayIpnController {

    private final VNPayService vnPayService;
    private final PaymentService paymentService;

    @GetMapping("/ipn")
    public ResponseEntity<VnpIpnResponse> handleIpn(HttpServletRequest request) {

        // 1) Lấy toàn bộ params
        Map<String, String> params = vnPayService.extractParams(request);

        // 2) Verify chữ ký
        if (!vnPayService.verifySignature(params)) {
            return ResponseEntity.ok(new VnpIpnResponse("97", "Invalid signature"));
        }

        // 3) Lấy các trường quan trọng
        String vnp_TxnRef = params.get("vnp_TxnRef");
        String vnp_ResponseCode = params.get("vnp_ResponseCode");
        String vnp_TransactionStatus = params.get("vnp_TransactionStatus");
        String vnp_AmountStr = params.get("vnp_Amount");

        Long amount = null;
        try {
            if (vnp_AmountStr != null) {
                amount = Long.parseLong(vnp_AmountStr) / 100L;
            }
        } catch (NumberFormatException ignored) {}

        if (vnp_TxnRef == null) {
            return ResponseEntity.ok(new VnpIpnResponse("01", "Order not found"));
        }

        // 4) Gọi service xử lý
        PaymentService.IpnResult result =
                paymentService.handleVnPayIpn(
                        vnp_TxnRef,
                        vnp_ResponseCode,
                        vnp_TransactionStatus,
                        amount
                );

        // 5) Map sang RspCode cho VNPay
        return switch (result) {
            case ORDER_NOT_FOUND ->
                    ResponseEntity.ok(new VnpIpnResponse("01", "Order not found"));
            case ALREADY_CONFIRMED ->
                    ResponseEntity.ok(new VnpIpnResponse("02", "Order already confirmed"));
            case UPDATED ->
                    ResponseEntity.ok(new VnpIpnResponse("00", "Confirm Success"));
        };
    }
}
