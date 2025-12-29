package com.chatapp.chat.controller;

import com.chatapp.chat.User;
import com.chatapp.chat.service.UserService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
         User user=userService.registerUser(
                request.getUsername(),
                request.getPassword(),
                request.getDisplayName()
        );
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName()
        );
    }
    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request){
        User user=userService.loginUser(
                request.getUsername(),
                request.getPassword()
        );
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName()
        );
    }
}
