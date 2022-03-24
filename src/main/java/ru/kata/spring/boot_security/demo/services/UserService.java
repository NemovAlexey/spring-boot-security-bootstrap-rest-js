package ru.kata.spring.boot_security.demo.services;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<User> findAllUsers();
    User findUserById(Long id);
//    void saveUser(User user, String[] roleNames);
    void deleteUser(Long id);
    User insertUser(User user);
    User updateUser(User user);
}
