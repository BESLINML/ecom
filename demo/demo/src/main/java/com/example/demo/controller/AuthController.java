package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "https://dynamic-jelly-ad6cf3.netlify.app")
public class AuthController {

    @Autowired
    private UserRepository userRepository;


    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user
    ) {

        Optional<User> existingUser =
                userRepository.findByEmail(
                        user.getEmail()
                );


        if (existingUser.isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body("Email already exists");

        }


        // Normal users by default

        if (
                user.getRole() == null ||
                user.getRole().trim().isEmpty()
        ) {

            user.setRole("USER");

        }


        User savedUser =
                userRepository.save(user);


        // Don't return password

        savedUser.setPassword(null);


        return ResponseEntity.ok(
                savedUser
        );

    }


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User loginUser
    ) {

        Optional<User> optionalUser =
                userRepository.findByEmail(
                        loginUser.getEmail()
                );


        if (optionalUser.isEmpty()) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");

        }


        User user =
                optionalUser.get();


        if (
                !user.getPassword()
                        .equals(
                                loginUser.getPassword()
                        )
        ) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");

        }


        // Don't send password to React

        user.setPassword(null);


        return ResponseEntity.ok(user);

    }

}
