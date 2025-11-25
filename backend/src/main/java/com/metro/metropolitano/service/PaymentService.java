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

    /**
     * Tạo (hoặc upsert) Payment ở trạng thái PENDING cho 1 ticket:
     *  - paymentTime = null => CHƯA THANH TOÁN
     *  - amount là số tiền VND mà user phải trả
     */
    @Transactional
    public Payment createOrUpdatePending(Ticket ticket, double amountVnd) {
        Payment p = repo.findByTicket_Id(ticket.getId()).orElseGet(Payment::new);

        p.setTicket(ticket);
        p.setPaymentMethod("VNPAY");
        p.setAmount(amountVnd);
        p.setPaymentTime(null); // null = PENDING

        return repo.save(p);
    }

    /**
     * Đánh dấu đã thanh toán (dùng cho flow return URL theo ticketId).
     * Nếu đã có Payment gắn với ticket thì set paymentTime = now.
     */
    @Transactional
    public Payment markPaid(Long ticketId) {
        Payment p = repo.findByTicket_Id(ticketId).orElseThrow();
        // Nếu muốn idempotent thì có thể check:
        // if (p.getPaymentTime() != null) return p;
        p.setPaymentTime(LocalDateTime.now());
        return repo.save(p);
    }

    /**
     * Đánh dấu thất bại / huỷ (theo ticketId).
     * Theo design hiện tại: thất bại thì vẫn để paymentTime = null
     * => hệ thống coi như chưa thanh toán, user có thể thanh toán lại.
     */
    @Transactional
    public Payment markFailed(Long ticketId) {
        Payment p = repo.findByTicket_Id(ticketId).orElseThrow();
        // Không set paymentTime => vẫn PENDING/UNPAID
        return repo.save(p);
    }

    // =========================================
    //           XỬ LÝ VNPay IPN
    // =========================================

    public enum IpnResult {
        ORDER_NOT_FOUND,   // Không tìm thấy Payment theo vnp_TxnRef
        ALREADY_CONFIRMED, // Đã xác nhận trước đó (idempotent)
        UPDATED            // Đã xử lý mới lần này
    }

    /**
     * Xử lý IPN từ VNPay.
     *
     * vnp_TxnRef chính là payment.id (do VNPayService createPaymentUrl dùng payment.getId()).
     * Điều kiện thanh toán thành công theo chuẩn VNPay:
     *   vnp_ResponseCode == "00" && vnp_TransactionStatus == "00"
     *
     * amount: nếu bạn muốn, có thể dùng để so khớp với payment.getAmount() (optional).
     */
    @Transactional
    public IpnResult handleVnPayIpn(
            String vnpTxnRef,
            String vnpResponseCode,
            String vnpTransactionStatus,
            Long amount
    ) {
        Long paymentId;
        try {
            paymentId = Long.valueOf(vnpTxnRef);
        } catch (NumberFormatException e) {
            return IpnResult.ORDER_NOT_FOUND;
        }

        Payment payment = repo.findById(paymentId).orElse(null);
        if (payment == null) {
            return IpnResult.ORDER_NOT_FOUND;
        }

        boolean success = "00".equals(vnpResponseCode) && "00".equals(vnpTransactionStatus);

        // Nếu đã có paymentTime (đã confirm trước đó) và lần này cũng là success
        // => coi như đã xử lý, không ghi đè nữa (idempotent)
        if (success && payment.getPaymentTime() != null) {
            return IpnResult.ALREADY_CONFIRMED;
        }

        if (success && payment.getPaymentTime() == null) {
            // Xác nhận thanh toán thành công lần đầu
            payment.setPaymentTime(LocalDateTime.now());
            repo.save(payment);
        } else {
            // TH thất bại:
            // theo design hiện tại ta không set paymentTime,
            // giữ nguyên null để hệ thống hiểu là chưa thanh toán.
            // Bạn có thể log thêm hoặc lưu trạng thái khác nếu muốn.
        }

        return IpnResult.UPDATED;
    }
}
