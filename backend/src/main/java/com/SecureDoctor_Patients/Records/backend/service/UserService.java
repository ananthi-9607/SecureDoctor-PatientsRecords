package com.SecureDoctor_Patients.Records.backend.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.SecureDoctor_Patients.Records.backend.entity.User;
import com.SecureDoctor_Patients.Records.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();


    // =========================
    // CONSTRUCTOR
    // =========================

    public UserService(UserRepository userRepository) {

        this.userRepository =
                Objects.requireNonNull(
                        userRepository,
                        "userRepository must not be null"
                );
    }


    // =========================
    // REGISTER / SAVE USER
    // =========================

    @Transactional
    public User saveUser(User user) {

        Objects.requireNonNull(
                user,
                "user must not be null"
        );


        // =========================
        // CHECK DUPLICATE EMAIL
        // =========================

        if (userRepository.existsByEmail(user.getEmail())) {

            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }


        // =========================
        // HASH PASSWORD
        // =========================

        if (user.getPasswordHash() != null
                && !user.getPasswordHash().isBlank()
                && !user.getPasswordHash().startsWith("$2a$")
                && !user.getPasswordHash().startsWith("$2b$")
                && !user.getPasswordHash().startsWith("$2y$")) {

            user.setPasswordHash(
                    passwordEncoder.encode(
                            user.getPasswordHash()
                    )
            );
        }


        // Save user
        return userRepository.save(user);
    }


    // =========================
    // LOGIN
    // =========================

    @Transactional(readOnly = true)
    public User login(
            String email,
            String password) {

        Objects.requireNonNull(
                email,
                "email must not be null"
        );

        Objects.requireNonNull(
                password,
                "password must not be null"
        );


        // Find user by email
        Optional<User> userOptional =
                userRepository.findByEmail(email);


        // Email not found
        if (userOptional.isEmpty()) {
            return null;
        }


        User user = userOptional.get();


        // Check password using BCrypt
        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        user.getPasswordHash()
                );


        // Login successful
        if (passwordMatches) {
            return user;
        }


        // Wrong password
        return null;
    }


    // =========================
    // GET ALL USERS
    // =========================

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // =========================
    // GET USER BY ID
    // =========================

    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long id) {

        return userRepository.findById(
                Objects.requireNonNull(
                        id,
                        "id must not be null"
                )
        );
    }


    // =========================
    // GET USER BY EMAIL
    // =========================

    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(
            String email) {

        return userRepository.findByEmail(
                Objects.requireNonNull(
                        email,
                        "email must not be null"
                )
        );
    }


    // =========================
    // GET USERS BY ROLE
    // =========================

    @Transactional(readOnly = true)
    public List<User> getUsersByRole(
            String role) {

        return userRepository.findByRole(role);
    }


    // =========================
    // DELETE USER
    // =========================

    @Transactional
    public void deleteUser(Long id) {

        userRepository.deleteById(
                Objects.requireNonNull(
                        id,
                        "id must not be null"
                )
        );
    }
}