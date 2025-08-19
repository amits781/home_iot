package com.aidyn.iot.dao;

import com.aidyn.iot.entity.User;
import com.aidyn.iot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class UserDao {

    @Autowired
    UserRepository repository;

    public User saveUser(User user) {
        return repository.save(user);
    }

    public List<User> getAllUser() {
        return repository.findAll();
    }

    public boolean checkIfEmailExists(String regEmail) {
        return repository.existsByRegEmail(regEmail);
    }

    public Optional<User> getUserByEmail(String regEmail) {
        return repository.findByRegEmail(regEmail);
    }
}
