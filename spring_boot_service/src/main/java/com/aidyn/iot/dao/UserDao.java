package com.aidyn.iot.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.aidyn.iot.entity.User;
import com.aidyn.iot.repository.UserRepository;

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
