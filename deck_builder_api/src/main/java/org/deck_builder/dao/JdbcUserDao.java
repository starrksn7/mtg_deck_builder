package org.deck_builder.dao;

import org.deck_builder.model.exceptions.UserNotFoundException;
import org.deck_builder.model.User;
import org.deck_builder.model.UserDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class JdbcUserDao implements UserDao{
    private final JdbcTemplate jdbcTemplate;

    public JdbcUserDao(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public User findUserByEmail(String email){
        String sql = "SELECT * FROM users WHERE email = ?";
        SqlRowSet result = jdbcTemplate.queryForRowSet(sql, email);
        if(result.next()){
            return mapRowToUser(result);
        } else {
            throw new UserNotFoundException();
        }
    }

    public User getUserById(int id){
        String sql = "SELECT * FROM users WHERE user_id = ?;";
        SqlRowSet result = jdbcTemplate.queryForRowSet(sql, id);

        if(result.next()){
            return mapRowToUser(result);
        } else {
            throw new UserNotFoundException();
        }
    }

    public boolean create(String email, String username, String password){
        String checkNameSql = "SELECT username FROM users WHERE username = ?;";
        SqlRowSet checkNameResult = jdbcTemplate.queryForRowSet(checkNameSql, username);
        String insertSql = "INSERT INTO users (username, password_hash, email, activated, role) VALUES (?, ?, ?, true, 'user');";
        String passwordHash = new BCryptPasswordEncoder().encode(password);

        if(checkNameResult.next()){
            return false;
        } else {
            jdbcTemplate.update(insertSql, username, passwordHash, email);
            return true;
        }
    }

    //The idea I have for this is that users created in the ui will always have a user role, but
    //if an admin is needed for some reason, they can be created by pinging the api directly
    public boolean createAdminUser(String email, String username, String password){
        String checkNameSql = "SELECT username FROM users WHERE username = ?;";
        SqlRowSet checkNameResult = jdbcTemplate.queryForRowSet(checkNameSql, username);
        String insertSql = "INSERT INTO users (username, password_hash, email, activated, role) Values (?, ?, ?, true, 'admin');";
        String passwordHash = new BCryptPasswordEncoder().encode(password);

        if(checkNameResult.next()){
            return false;
        } else {
            jdbcTemplate.update(insertSql, username, passwordHash, email);
            return true;
        }
    }

    @Override
    public User updateUserProfile(int userId, String email, String username) {
        String sql = "UPDATE users\n" +
                "SET email = ?,\n" +
                "username = ?\n" +
                "WHERE user_id = ?;";
        jdbcTemplate.update(sql,email,username, userId);

        return getUserById(userId);
    }

    public User login (String username, String password){
        User user = new User();

        return user;
    }

    private User mapRowToUser(SqlRowSet rs) {
        User user = new User();
        user.setId(rs.getInt("user_id"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password_hash"));
        user.setActivated(rs.getBoolean("activated"));
        user.setUsername(rs.getString("username"));
        return user;
    }
}
