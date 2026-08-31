
package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
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

        if (
                user.getRole() == null ||
                user.getRole().trim().isEmpty()
        ) {

            user.setRole("USER");

        }

        User savedUser =
                userRepository.save(user);

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

        System.out.println(
                "LOGIN EMAIL: [" +
                loginUser.getEmail() +
                "]"
        );

        Optional<User> optionalUser =
                userRepository.findByEmail(
                        loginUser.getEmail()
                );

        if (optionalUser.isEmpty()) {

            System.out.println(
                    "USER NOT FOUND"
            );

            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        User user =
                optionalUser.get();

        String dbPassword =
                user.getPassword();

        String enteredPassword =
                loginUser.getPassword();

        System.out.println(
                "USER FOUND: [" +
                user.getEmail() +
                "]"
        );

        System.out.println(
                "DB PASSWORD LENGTH: " +
                (dbPassword == null
                        ? "NULL"
                        : dbPassword.length())
        );

        System.out.println(
                "ENTERED PASSWORD LENGTH: " +
                (enteredPassword == null
                        ? "NULL"
                        : enteredPassword.length())
        );

        boolean passwordMatches =
                dbPassword != null &&
                enteredPassword != null &&
                dbPassword.equals(enteredPassword);

        System.out.println(
                "PASSWORD MATCH: " +
                passwordMatches
        );

        if (!passwordMatches) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        user.setPassword(null);

        return ResponseEntity.ok(user);
    }


@GetMapping("/debug-db")
public ResponseEntity<?> debugDb() {

    return ResponseEntity.ok(
            java.util.Map.of(
                    "users", userRepository.count()
            )
    );
}
}
