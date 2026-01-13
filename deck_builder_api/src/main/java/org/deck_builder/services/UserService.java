package org.deck_builder.services;

import org.deck_builder.dao.DeckDao;
import org.deck_builder.dao.UserDao;
import org.deck_builder.model.*;

import java.util.List;


public class UserService {

    UserDao userDao;
    DeckDao deckDao;

    public User updateUserProfile(UserDTO userDTO) {
        return userDao.updateUserProfile(userDTO.getUserId(), userDTO.getEmail(), userDTO.getUserName());
    }

    public User findUserByEmail(UserDTO userDTO) {
        return userDao.findUserByEmail(userDTO.getEmail());
    }

    public User getuserById(UserDTO userDTO) {
        return userDao.getUserById(userDTO.getUserId());
    }

    public boolean createUser(RegisterUserDTO registerUserDTO) {
        return userDao.create(registerUserDTO.getEmail(), registerUserDTO.getUsername(), registerUserDTO.getPassword(), registerUserDTO.getRole());
    }

    public List<Deck> getDecksById(int userId){
        return deckDao.findDecksByUser(userId);
    }

    public User login(LoginDTO loginDTO){
        return userDao.login(loginDTO.getEmail(), loginDTO.getPassword());
    }
}
