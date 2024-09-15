package org.deck_builder.dao;


import org.deck_builder.model.User;
import org.deck_builder.model.UserDTO;

public interface UserDao {

    User updateUserProfile(int userId, UserDTO updatedUser);

    User findUserByEmail(String email);

    User getUserById(int userId);

    boolean create(String email, String userName, String password);

}
