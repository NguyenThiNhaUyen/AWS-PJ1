package com.metro.metropolitano.service;

import com.metro.metropolitano.model.Payment;
import com.metro.metropolitano.model.Ticket;
import com.metro.metropolitano.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository repo;

    /** Tạo (hoặc upsert) bản ghi Payment ở trạng thái "chờ thanh toán": paymentTime = null */
    @Transactional
    public Payment createOrUpdatePending(Ticket ticket, double amountVnd) {
        var p = repo.findByTicket_Id(ticket.getId()).orElseGet(Payment::new);
        p.setTicket(ticket);
        p.setPaymentMethod("VNPAY");
        p.setAmount(amountVnd);
        p.setPaymentTime(null); // null = PENDING
        return repo.save(p);
    }

    /** Đánh dấu đã thanh toán thành công: set thời điểm thanh toán */
    @Transactional
    public Payment markPaid(Long ticketId) {
        var p = repo.findByTicket_Id(ticketId).orElseThrow();
        p.setPaymentTime(LocalDateTime.now());
        return repo.save(p);
    }

    /** (tuỳ chọn) huỷ/ thất bại: để trống paymentTime; giữ record để truy vết */
    @Transactional
    public Payment markFailed(Long ticketId) {
        var p = repo.findByTicket_Id(ticketId).orElseThrow();
        // Không set paymentTime => vẫn coi là chưa thanh toán
        return repo.save(p);
    }
}
