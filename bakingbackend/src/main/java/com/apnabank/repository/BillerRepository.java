package com.apnabank.repository;

import com.apnabank.model.Biller;
import com.apnabank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillerRepository extends JpaRepository<Biller, Long> {
    List<Biller> findByUser(User user);
    Optional<Biller> findByIdAndUser(Long id, User user);
} 