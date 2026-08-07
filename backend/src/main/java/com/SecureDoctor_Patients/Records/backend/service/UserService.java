package com.SecureDoctor_Patients.Records.backend.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.SecureDoctor_Patients.Records.backend.entity.User;
import com.SecureDoctor_Patients.Records.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = Objects.requireNonNull(userRepository, "userRepository must not be null");
    }

    // Save User
    @Transactional
    public User saveUser(User user) {
        return userRepository.save(Objects.requireNonNull(user, "user must not be null"));
    }

    // Get all users
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(Objects.requireNonNull(id, "id must not be null"));
    }

    // Get user by Email
    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(Objects.requireNonNull(email, "email must not be null"));
    }

    // Delete user
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(Objects.requireNonNull(id, "id must not be null"));
    }
}