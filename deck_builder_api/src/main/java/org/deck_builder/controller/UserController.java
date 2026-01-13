package org.deck_builder.controller;

import org.deck_builder.dao.DeckDao;
import org.deck_builder.dao.UserDao;
import org.deck_builder.model.*;
import org.deck_builder.services.UserService;
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

    UserService userService;

    @PutMapping(path="/update")
    public User updateUserProfile(@RequestBody UserDTO userDTO){
        return userService.updateUserProfile(userDTO);
    }

    @GetMapping(path="/findByEmail")
    public User findUserByEmail(@RequestBody UserDTO userDTO){
        return userService.findUserByEmail(userDTO);
    }

    @GetMapping(path="/findById")
    public User getUserById(@RequestBody UserDTO userDTO){
        return userService.getUserById(userDTO);
    }

    @PostMapping(path="/create")
    public boolean create(@RequestBody RegisterUserDTO registerUserDTO){
        return userService.create(registerUserDTO);
    }

    @GetMapping(path = "")
    public List<Deck> findDecksByUser(@RequestParam int userId){
        return userService.findDecksByUser(userId);
    }

    @PostMapping(path = "/login")
    public User login(@RequestBody LoginDTO loginDTO){
        return userService.login(loginDTO);
    }
}
