package com.example.springapp.controller;

import com.example.springapp.BaseResponseDTO;
import com.example.springapp.config.jwt.JwtTokenProvider;
import com.example.springapp.repo.UserRepository;
import com.example.springapp.model.Address;
import com.example.springapp.model.User;
import com.example.springapp.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8081/")
public class AddressController {

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AddressService addressService;

    @GetMapping("/api/address")
    public ResponseEntity<BaseResponseDTO> getAddress(@RequestHeader(value = "Authorization", defaultValue = "") String token) {
        try {
            User user = userRepository.findByEmail(tokenProvider.getUsernameFromToken(tokenProvider.getTokenFromHeader(token))).orElseThrow();
            List<Address> addressList = addressService.getAddress(user);
            return ResponseEntity.ok(new BaseResponseDTO("success", addressList));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new BaseResponseDTO("failed"));
        }
    }

    @GetMapping("/api/auth/address/edit")
    public ResponseEntity<BaseResponseDTO> getAddressById(@RequestParam String addressId) {
        try {
            Address address = addressService.getAddressById(Integer.parseInt(addressId));
            return ResponseEntity.ok(new BaseResponseDTO("success", address));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new BaseResponseDTO("failed"));
        }
    }

    @PostMapping("/api/address")
    public ResponseEntity<BaseResponseDTO> addAddress(@RequestHeader(value = "Authorization", defaultValue = "") String token, @RequestBody Address address) {
        try {
            User user = userRepository.findByEmail(tokenProvider.getUsernameFromToken(tokenProvider.getTokenFromHeader(token))).orElseThrow();
            addressService.addAddress(user, address);
            return ResponseEntity.ok(new BaseResponseDTO("success"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new BaseResponseDTO("failed"));
        }
    }

    @PutMapping("/api/address")
    public ResponseEntity<BaseResponseDTO> updateAddress(@RequestHeader(value = "Authorization", defaultValue = "") String token, @RequestBody Address address, @RequestParam String addressId) {
        try {
            User user = userRepository.findByEmail(tokenProvider.getUsernameFromToken(tokenProvider.getTokenFromHeader(token))).orElseThrow();
            if (addressService.hasUser(user, Integer.valueOf(addressId))) {
                addressService.updateAddress(address, Integer.valueOf(addressId));
                return ResponseEntity.ok(new BaseResponseDTO("success"));
            } else {
                return ResponseEntity.ok(new BaseResponseDTO("something went wrong"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new BaseResponseDTO("failed"));
        }
    }

    @DeleteMapping("/api/address")
    public ResponseEntity<BaseResponseDTO> deleteAddress(@RequestHeader(value = "Authorization", defaultValue = "") String token, @RequestParam String addressId) {
        try {
            User user = userRepository.findByEmail(tokenProvider.getUsernameFromToken(tokenProvider.getTokenFromHeader(token))).orElseThrow();
            if (addressService.hasUser(user, Integer.valueOf(addressId))) {
                addressService.deleteAddress(Integer.valueOf(addressId));
                return ResponseEntity.ok(new BaseResponseDTO("success"));
            } else {
                return ResponseEntity.ok(new BaseResponseDTO("something went wrong"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new BaseResponseDTO("failed"));
        }
    }
}
