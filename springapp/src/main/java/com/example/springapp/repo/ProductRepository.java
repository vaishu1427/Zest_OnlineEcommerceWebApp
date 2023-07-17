package com.example.springapp.repo;

import com.example.springapp.dto.response.SellerDashboardResponse;
import com.example.springapp.model.Product;
import com.example.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.SqlResultSetMapping;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findAllByCategory(String cat);

    List<Product> findAllBySeller(User seller);

    List<Product> findByNameContainingIgnoreCase(String name);

    @Query(value = "SELECT "
            + "SUM(CASE WHEN pt.product_id IS NOT NULL THEN p.price * pt.quantity ELSE 0 END) AS totalRevenue, "
            + "COUNT(DISTINCT p.id) AS totalNoProducts, "
            + "COUNT(DISTINCT CASE WHEN pt.product_id IS NOT NULL THEN p.id END) AS soldProducts, "
            + "COUNT(DISTINCT CASE WHEN pt.product_id IS NULL THEN p.id END) AS unsoldProducts, "
            + "COUNT(DISTINCT CASE WHEN p.quantity <= 0 THEN p.id END) AS outOfStockProducts, "
            + "COUNT(DISTINCT pt.buyer_id) AS totalCustomers "
            + "FROM product p "
            + "LEFT JOIN purchase pt ON p.id = pt.product_id "
            + "WHERE p.seller_id = :sellerId AND p.is_deleted = 0",
            nativeQuery = true)
    List<Object[]> getSellerDashboard(@Param("sellerId") Long sellerId);
}