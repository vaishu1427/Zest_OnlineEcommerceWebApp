package com.example.springapp.controller;

import com.example.springapp.BaseResponseDTO;
import com.example.springapp.config.jwt.JwtTokenProvider;
import com.example.springapp.dto.request.PurchaseRequestDto;
import com.example.springapp.model.User;
import com.example.springapp.repo.UserRepository;
import com.example.springapp.service.ProductService;
import com.example.springapp.model.Purchase;
import com.example.springapp.service.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:8081/")
public class PurchaseController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    private final PurchaseService purchaseService;
    @Autowired
    private ProductService productService;

    @Autowired
    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }


    // Test Case
    @GetMapping("/purchase/{id}")
    public ResponseEntity<Purchase> getPurchaseById(@PathVariable int id) {
        Purchase purchase = purchaseService.getPurchaseById(id);
        return ResponseEntity.ok(purchase);
    }
    @GetMapping("/api/purchase/buyer")
    public ResponseEntity<BaseResponseDTO> getPurchaseByBuyer(@RequestHeader(value = "Authorization") String token) {
        User user = userRepository.findByEmail(tokenProvider.getUsernameFromToken(tokenProvider.getTokenFromHeader(token))).orElseThrow();
        List<Purchase> purchases = purchaseService.getPurchaseByBuyer(user);
        return ResponseEntity.ok(new BaseResponseDTO("success",purchases));
    }
    @GetMapping("/api/auth/buyer/{id}")
    public ResponseEntity<BaseResponseDTO> getPurchaseByBuyeridd(@PathVariable("id") Integer id) {
        User user = userRepository.findByUseridd(id);
        List<Purchase> purchases = purchaseService.getPurchaseByBuyer(user);
        return ResponseEntity.ok(new BaseResponseDTO("success",purchases));
    }

    @GetMapping("/api/seller/product/purchase")
    public ResponseEntity<BaseResponseDTO> getPurchaseByProduct(@RequestParam String productId) {
        List<Purchase> purchases = purchaseService.getPurchaseByProduct(productId);
        return ResponseEntity.ok(new BaseResponseDTO("success",purchases));
    }

    // Test Case
    @GetMapping("/purchase/buyer")
    public ResponseEntity<List<Map<String, Object>>> getPurchaseByBuyerId(@RequestParam("buyerId") int buyerId) {
        List<Map<String, Object>> result = purchaseService.getPurchaseByBuyerId(buyerId);
        return ResponseEntity.ok(result);
    }


    @PostMapping("/api/purchase")
    public ResponseEntity<BaseResponseDTO> makePurchas(@RequestHeader(value = "Authorization", defaultValue = "") String token,
                                                        @RequestBody PurchaseRequestDto purchaseRequestDto) {
        purchaseService.makePurchase(purchaseRequestDto.getCartIds(), purchaseRequestDto.getPaymentMethod());
        return ResponseEntity.ok(new BaseResponseDTO("success"));
    }

    @PostMapping("/purchase")
    public ResponseEntity<List<Purchase>> makePurchase(@RequestBody PurchaseRequestDto purchaseRequestDto) {
                
        List<Purchase> purchases = purchaseService.makePurchase(purchaseRequestDto.getCartIds(),purchaseRequestDto.getPaymentMethod());
        return ResponseEntity.ok(purchases);
    }

}
