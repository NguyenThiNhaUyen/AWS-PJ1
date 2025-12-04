package com.metro.metropolitano.controller;


import com.metro.metropolitano.dto.AdminPaymentDTO;
import com.metro.metropolitano.service.AdminPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
public class AdminPaymentController {
    private final AdminPaymentService service;

    @GetMapping
    public Page<AdminPaymentDTO> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status
    ) {
        return service.getAll(status, page, size);
    }

    @GetMapping("/{id}")
    public AdminPaymentDTO getPaymentDetails(@PathVariable Long id) {
        return service.getOne(id);
    }
}
