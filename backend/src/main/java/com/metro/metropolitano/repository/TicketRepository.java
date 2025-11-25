package com.metro.metropolitano.repository;

import com.metro.metropolitano.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket,Long> {
    Optional<Ticket> findByTicketCode(String code);

    List<Ticket> findByAccount_IdOrderByIdDesc(Long accountId);


    List<Ticket> findByAccount_UsernameOrderByIdDesc(String username);

    //Số vé đã thanh toán
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status <> 'PENDING'")
    long countPaidTickets();

    // Top tuyến được đi nhiều nhất (dựa trên vé đã thanh toán)
    @Query("""
        SELECT t.startStation.name, t.endStation.name, COUNT(t)
        FROM Ticket t
        WHERE t.status IN ('PENDING', 'PAID', 'ACTIVATED', 'USED')
        GROUP BY t.startStation.name, t.endStation.name
        ORDER BY COUNT(t) DESC 
    """)
    List<Object[]> findTopRoutesRaw();
}
