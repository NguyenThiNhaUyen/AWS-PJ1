package com.metro.metropolitano.repository;

import com.metro.metropolitano.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTicket_Id(Long ticketId);

    //Total doanh thu all time, chỉ tính payment != null
    @Query("SELECT COALESCE(SUM(p.amount), 0) From Payment p WHERE p.paymentTime IS NOT NULL")
    double getTotalRevenue();

    //doanh thu trong khoảng thời gian
    @Query("""
            SELECT COALESCE(SUM(p.amount), 0)
            FROM Payment p
            WHERE p.paymentTime IS NOT NULL
                AND p.paymentTime BETWEEN :start AND :end
    """)
    double getRevenueBetween(LocalDateTime start, LocalDateTime end);

    //Số vé đã thanh toán trong khoảng thời gian
    @Query("""
        SELECT COUNT(p)
        FROM Payment p
        WHERE p.paymentTime IS NOT NULL 
            AND  p.paymentTime BETWEEN :start AND :end
    """)
    long countPaidTicketsBetween(LocalDateTime start, LocalDateTime end);

    @Query("""
        SELECT p FROM Payment p
        JOIN p.ticket t
        JOIN t.account a
        WHERE (:status IS NULL OR p.status = :status)
        """)
    Page<Payment> filter(@Param("status") String status, Pageable pageable);
}
