package com.SecureDoctor_Patients.Records.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.SecureDoctor_Patients.Records.backend.entity.User;
import com.SecureDoctor_Patients.Records.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void saveUser_shouldReturnSavedUser() {
        User user = buildUser(1L, "Jane Doe", "jane@example.com");
        when(userRepository.save(user)).thenReturn(user);

        User savedUser = userService.saveUser(user);

        assertSame(user, savedUser);
        verify(userRepository).save(user);
    }

    @Test
    void getAllUsers_shouldReturnAllUsers() {
        List<User> users = List.of(buildUser(1L, "Jane Doe", "jane@example.com"), buildUser(2L, "John Doe", "john@example.com"));
        when(userRepository.findAll()).thenReturn(users);

        List<User> result = userService.getAllUsers();

        assertEquals(users, result);
        verify(userRepository).findAll();
    }

    @Test
    void getUserById_shouldReturnUserWhenPresent() {
        User user = buildUser(1L, "Jane Doe", "jane@example.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserById(1L);

        assertTrue(result.isPresent());
        assertSame(user, result.get());
        verify(userRepository).findById(1L);
    }

    @Test
    void getUserByEmail_shouldReturnUserWhenPresent() {
        User user = buildUser(1L, "Jane Doe", "jane@example.com");
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserByEmail("jane@example.com");

        assertTrue(result.isPresent());
        assertSame(user, result.get());
        verify(userRepository).findByEmail("jane@example.com");
    }

    @Test
    void getUserByEmail_shouldReturnEmptyWhenUserDoesNotExist() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserByEmail("missing@example.com");

        assertFalse(result.isPresent());
        verify(userRepository).findByEmail("missing@example.com");
    }

    @Test
    void deleteUser_shouldDelegateToRepository() {
        userService.deleteUser(5L);

        verify(userRepository).deleteById(5L);
    }

    private User buildUser(Long id, String fullName, String email) {
        User user = new User();
        user.setId(id);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword("secret");
        user.setPhone("1234567890");
        user.setRole("PATIENT");
        return user;
    }
}
