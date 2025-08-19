package com.aidyn.iot.repository;

import com.aidyn.iot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    boolean existsByRegEmail(String regEmail);

    Optional<User> findByRegEmail(String regEmail);
}
