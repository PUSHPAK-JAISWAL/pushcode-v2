package com.pushcode.security.service;

import com.pushcode.security.dto.RegisterRequest;
import com.pushcode.security.model.User;
import com.pushcode.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(RegisterRequest registerRequest) {
        if(userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User u = User.builder()
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .roles(Set.of("ROLE_USER"))
                .createdAt(Instant.now())
                .build();

        return userRepository.save(u);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(ObjectId id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user) {
        if(userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(Instant.now());
        return userRepository.save(user);
    }

    public User updateUser(ObjectId id, User update) {
        var u = userRepository.findById(id).orElseThrow(()-> new NoSuchElementException("User not found"));

        if(update.getPassword() != null && !update.getPassword().isBlank()) {
            u.setPassword(passwordEncoder.encode(update.getPassword()));
        }

        if(update.getRoles() != null && !update.getRoles().isEmpty()) {
            u.setRoles(update.getRoles());
        }

        return userRepository.save(u);
    }

    public void deleteUser(ObjectId id) {
        userRepository.deleteById(id);
    }

}
