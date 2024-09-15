package org.deck_builder.controller;

import org.deck_builder.dao.UserDao;
import org.deck_builder.model.User;
import org.deck_builder.model.UserDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    private UserDao userDao;

    @PutMapping(path="/update")
    public User updateUserProfile(int userId, UserDTO updatedUser){
        return userDao.updateUserProfile(userId, updatedUser);
    }

    @GetMapping(path="/findByEmail")
    public User findUserByEmail(String email){
        return userDao.findUserByEmail(email);
    }

    @GetMapping(path="/findById")
    public User getUserById(int userId){
        return userDao.getUserById(userId);
    }

    @PostMapping(path="/create")
    public boolean create(String email, String username, String password){
        return userDao.create(email, username, password);
    }
}