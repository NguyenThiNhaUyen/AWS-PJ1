package com.metro.metropolitano.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String lineName;
    private Integer orderIndex;


    public Station(String n, String s, int i) {
        this.name = n;
        this.lineName=s;
        this.orderIndex=i;
    }
}
