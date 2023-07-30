package com.example.springapp.service;

import com.example.springapp.config.jwt.JwtTokenProvider;
import com.example.springapp.exception.ProductNotFoundException;
import com.example.springapp.model.Cart;
import com.example.springapp.model.Product;
import com.example.springapp.model.User;
import com.example.springapp.repo.CartRepository;
import com.example.springapp.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.springapp.repo.UserRepository;

import java.io.IOException;
import java.util.Optional;
import java.util.List;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import javax.transaction.Transactional;


@Service
public class UserService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    CartRepository cartRepository;

    @Autowired
    ProductRepository productRepository;
    @Lazy
    @Autowired
    private AuthenticationManager authenticationManager;
    @Lazy
    @Autowired
    private JwtTokenProvider tokenProvider;
    @Lazy
    @Autowired
    PasswordEncoder passwordEncoder;

    public boolean verifyUser(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(""));
        return new BCryptPasswordEncoder().matches(password, user.getPassword());
    }

    public boolean checkUserNameExists(String email){
        return userRepository.findByEmail(email).isPresent();
    }

    public boolean checkUserNameExistsForSignup(String email){
        return userRepository.findByEmail(email).isPresent();
    }

    public boolean checkUserNameEnabledForSignin(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.isEnabled()) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public boolean checkUserNameEnabledForSignup(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.isEnabled()) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public String generateToken(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);
        return token;
    }


    public boolean createUser(User newUser) {
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        userRepository.save(newUser);
        return true;
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(""));
    }


    public boolean validateToken(String token) {
        return tokenProvider.validateToken(token);
    }

    public User getUserFromToken(String token) {
        return userRepository.findByEmail(tokenProvider.getUsernameFromToken(token)).orElseThrow();
    }

    //Get all user
    public List<User> findallUser() {
        return userRepository.findUser();
    }

    // Get User by Id
    public List<User> getUsersById(Integer id) {
        return userRepository.findByUserid(id);
    }
    // Update User

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User updateUser(Long id, User incomingUser) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            existingUser.setFirstName(incomingUser.getFirstName());
            existingUser.setLastName(incomingUser.getLastName());
            existingUser.setPassword(passwordEncoder.encode(incomingUser.getPassword()));
            existingUser.setPhone(incomingUser.getPhone());
            //existingUser.setRoles(incomingUser.getRoles());

            return userRepository.save(existingUser);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    //disable buyer
    @Transactional
    public User disableUserById(Long id) {
        Optional<User> optionalBuyer = userRepository.findById(id);
        if (optionalBuyer.isPresent()) {
            User existingUser = optionalBuyer.get();
            existingUser.setEnabled(!existingUser.isEnabled());
            System.out.println(existingUser.getRoles()+" "+id);
            if("ROLE_SELLER".equals(existingUser.getRoles())){
                System.out.println(existingUser.getRoles()+"2");
                try {
                    List<Product> productList = productRepository.findAllBySeller(existingUser);
                    System.out.println("ProductList");
                    for (Product p : productList) {
                        List<Cart> cartProducts = cartRepository.findAllByProduct(p);
                        for (int i = 0; i < cartProducts.size(); i++) {
                            Cart c = cartProducts.get(i);
                            c.setEnabled(!c.isEnabled());
                            cartRepository.save(c);
                        }
                        p.setEnabled(!p.isEnabled());
                        System.out.println(p.getId());
                        productRepository.save((p));
                    }
                }
                catch (Exception e){
                    e.printStackTrace();
                    throw e;
                }
            }
            return userRepository.save(existingUser);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Buyer not found");
        }
    }
}


