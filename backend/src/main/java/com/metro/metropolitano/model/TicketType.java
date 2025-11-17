    package com.metro.metropolitano.model;


    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    @Entity
    @Table(name = "ticket_types")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class TicketType {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;
        private Double price;
        private Integer durationHours;
        private Boolean isRouteBased=false;


        public TicketType(String s, double v, int i, boolean b) {
            this.name=s;
            this.price=v;
            this.durationHours=i;
            this.isRouteBased=b;
        }
    }
