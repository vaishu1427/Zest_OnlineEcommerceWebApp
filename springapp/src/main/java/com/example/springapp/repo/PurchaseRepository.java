package com.example.springapp.repo;

import com.example.springapp.model.Product;
import com.example.springapp.model.Purchase;
import com.example.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    List<Purchase> findByBuyerId(long buyerId);

    Optional<Purchase> findById(int id);

    List<Purchase> findAllByBuyer(User user);

    List<Purchase> findAllByProduct(Product product);

}
