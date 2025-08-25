package org.deck_builder.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import org.deck_builder.dao.UserDao;
import org.deck_builder.model.LoginDTO;
import org.deck_builder.model.RegisterUserDTO;
import org.deck_builder.model.User;
import org.deck_builder.model.exceptions.UserAlreadyExistsException;
import org.deck_builder.security.jwt.JWTFilter;
import org.deck_builder.security.jwt.TokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
class AuthenticationController {

    private final TokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private UserDao userDao;

    public AuthenticationController(TokenProvider tokenProvider, AuthenticationManager authenticationManager, UserDao userDao) {
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
        this.userDao = userDao;
    }

    @PostMapping(value = "/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginDTO loginDto) {

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword());

        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.createToken(authentication, false);

        User user = userDao.findUserByEmail(loginDto.getEmail());

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        return new ResponseEntity<>(new LoginResponse(jwt, user), httpHeaders, HttpStatus.OK);
    }

    @PostMapping(value = "/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterUserDTO newUser) {
        userDao.create(newUser.getEmail(),newUser.getUsername(),newUser.getPassword());
    }

    static class LoginResponse {

        private String token;
        private User user;

        LoginResponse(String token, User user) {
            this.token = token;
            this.user = user;
        }

        @JsonProperty("token")
        String getToken() {
            return token;
        }

        void setToken(String token) {
            this.token = token;
        }

        @JsonProperty("user")
        public User getUser() {
            return user;
        }

        public void setUser(User user) {
            this.user = user;
        }
    }
}
