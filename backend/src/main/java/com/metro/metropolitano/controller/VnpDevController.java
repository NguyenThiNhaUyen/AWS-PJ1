package com.metro.metropolitano.controller;

import com.metro.metropolitano.service.VNPayService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.TreeMap;

@RestController
@RequestMapping("/api/dev")
@RequiredArgsConstructor
public class VnpDevController {

    private final VNPayService vnPayService;

    @GetMapping("/vnpay-ipn-sign")
    public Map<String, String> signIpn(@RequestParam Map<String, String> params) {
        // giống verifySignature nhưng trả ra data + hash để bạn xem
        Map<String,String> sorted = new TreeMap<>();
        for (var e : params.entrySet()) {
            String k = e.getKey();
            if ("vnp_SecureHash".equalsIgnoreCase(k)
                    || "vnp_SecureHashType".equalsIgnoreCase(k)) continue;
            sorted.put(k, e.getValue());
        }

        String data = VNPayService.buildQuery(sorted);     // cho buildQuery thành public static
        String hash = VNPayService.hmacSHA512("7MUW6K20MIXQKEFYPKX892UJ3ELSD40Z", data);

        return Map.of(
                "dataToSign", data,
                "secureHash", hash
        );
    }
}
