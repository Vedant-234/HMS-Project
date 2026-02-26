package com.hms.hms_backend.daos;

import com.hms.hms_backend.entities.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAccountDao extends JpaRepository<UserAccount, Integer> {
    Optional<UserAccount> findByEmail(String email);
}