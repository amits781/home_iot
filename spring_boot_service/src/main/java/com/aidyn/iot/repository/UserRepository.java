package com.aidyn.iot.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.aidyn.iot.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

  boolean existsByRegEmail(String regEmail);

  Optional<User> findByRegEmail(String regEmail);
}
