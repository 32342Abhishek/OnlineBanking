package com.apnabank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "billers")
public class Biller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillerType type;

    @Column(nullable = false)
    private String description;

    @Column
    private String website;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "biller", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BillPayment> billPayments = new ArrayList<>();

    @OneToMany(mappedBy = "biller", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RecurringPayment> recurringPayments = new ArrayList<>();
} 