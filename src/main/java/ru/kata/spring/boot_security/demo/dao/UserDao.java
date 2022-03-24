package ru.kata.spring.boot_security.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserDao extends JpaRepository<User,Long> {
    @Query("select u from User u join fetch u.roles where u.email = :email")
    User findUserByEmail(@Param("email") String email);
}
