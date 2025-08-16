package org.deck_builder.controller;

import org.deck_builder.dao.DeckDao;
import org.deck_builder.dao.UserDao;
import org.deck_builder.model.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    private UserDao userDao;
    private DeckDao deckDao;

    private UserController(UserDao userDao, DeckDao deckDao){
        this.userDao = userDao;
        this.deckDao = deckDao;
    }

    @PutMapping(path="/update")
    public User updateUserProfile(@RequestBody UserDTO userDTO){
        return userDao.updateUserProfile(userDTO.getUserId(), userDTO.getEmail(), userDTO.getUserName());
    }

    @GetMapping(path="/findByEmail")
    public User findUserByEmail(@RequestBody UserDTO userDTO){
        return userDao.findUserByEmail(userDTO.getEmail());
    }

    @GetMapping(path="/findById")
    public User getUserById(@RequestBody UserDTO userDTO){
        return userDao.getUserById(userDTO.getUserId());
    }

    @PostMapping(path="/create")
    public boolean create(@RequestBody RegisterUserDTO registerUserDTO){
        return userDao.create(registerUserDTO.getEmail(), registerUserDTO.getUsername(), registerUserDTO.getPassword());
    }

    @GetMapping(path = "")
    public List<Deck> findDecksByUser(@RequestParam int userId){
        return deckDao.findDecksByUser(userId);
    }

    @PostMapping(path = "/login")
    public User login(@RequestBody LoginDTO loginDTO){
        return userDao.login(loginDTO.getEmail(), loginDTO.getPassword());
    }
}
