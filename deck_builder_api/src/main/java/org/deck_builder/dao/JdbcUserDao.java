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
        String insertSql = "INSERT INTO users (username, password_hash, email, activated) VALUES (?, ?, ?, true);";
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
        user.setAuthorities(Objects.requireNonNull(rs.getString("role")));
        user.setActivated(true);
        return user;
    }
}
