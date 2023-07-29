package com.example.springapp.controller;

import com.example.springapp.BaseResponseDTO;
import com.example.springapp.dto.request.UserLoginDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.springapp.model.User;
import com.example.springapp.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.List;


@RestController
public class UserController {


    @Autowired
    UserService userService;


    @GetMapping("/api/auth/validateToken")
    @CrossOrigin(origins = "http://localhost:8081/")
    public ResponseEntity<BaseResponseDTO> home(@RequestHeader(value = "Authorization", defaultValue = "") String token) {
        Map<Object, Object> data = new HashMap<>();
        if (userService.validateToken(token)) {
            data.put("user", userService.getUserFromToken(token));
            return ResponseEntity.ok(new BaseResponseDTO("success", data));
        }
        return new ResponseEntity<>(new BaseResponseDTO("failed", data), HttpStatus.UNAUTHORIZED);
    }

    //Get all users
    @GetMapping(value = "/api/auth/user")
    @CrossOrigin(origins = "http://localhost:8081/")
    public List<User> getAllUser() {
        return userService.findallUser();
    }

    @PostMapping("/api/auth/register")
    @CrossOrigin(origins = "http://localhost:8081/")
    public BaseResponseDTO createUser(@RequestBody User newUser) {
        if (userService.checkUserNameExistsForSignup(newUser.getEmail())) {
            return new BaseResponseDTO("Already have an account");
        } else {
            if (userService.createUser(newUser)) {
                return new BaseResponseDTO("success");
            } else {
                return new BaseResponseDTO("failed");
            }
        }
    }

    @PostMapping("/api/auth/login")
    @CrossOrigin(origins = "http://localhost:8081/")
    public BaseResponseDTO loginUser(@RequestBody UserLoginDto loginDetails) {
        if (userService.checkUserNameExists(loginDetails.getEmail())) {
            if (userService.verifyUser(loginDetails.getEmail(), loginDetails.getPassword())) {
                Map<Object, Object> data = new HashMap<>();
                String token = userService.generateToken(loginDetails.getEmail(), loginDetails.getPassword());
                data.put("token", token);
                User currentUser = userService.loadUserByUsername(loginDetails.getEmail());
                data.put("currentUser", currentUser);
                return new BaseResponseDTO("success", data);
            } else {
                return new BaseResponseDTO("password invalid");
            }
        } else {
            return new BaseResponseDTO("Account not exist");
        }
    }

    //Update user details
    @PutMapping(value = "/api/auth/user/{id}")
    @CrossOrigin(origins = "http://localhost:8081/")
    public User updateUser(@PathVariable Long id, @RequestBody User incomingUser) {
        return userService.updateUser(id, incomingUser);
    }

    //Admin authorizations
    // disable buyer by id
    @PutMapping(value = "/api/auth/buyer/{id}/disable")
    @CrossOrigin(origins = "http://localhost:8081/")
    public User disableBuyer(@PathVariable Long id) {
        return userService.disableBuyer(id);
    }


    //delete buyer by id
    @PutMapping(value = "/api/auth/buyer/{id}/delete")
    @CrossOrigin(origins = "http://localhost:8081/")
    public User deleteBuyer(@PathVariable Long id) {
        return userService.deleteBuyer(id);
    }
}
