package org.deck_builder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

public class User {

    private int id;
    private String email;
    private String userName;
    @JsonIgnore
    private String password;
    @JsonIgnore
    private boolean activated;
    private Set<Authority> authorities = new HashSet<>();


    public User(int id, String email, String userName, String password, String authorities){
        this.id = id;
        this.email = email;
        this.userName = userName;
        this.password = password;
        if(authorities != null){
            this.setAuthorities(authorities);
        }
        this.activated = true;
    }

    public User(){
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public Set<Authority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<Authority> authorities) {
        this.authorities = authorities;
    }

    public void setAuthorities(String authorities){
        String[] roles = authorities.split(",");
        for(String role : roles){
            String authority = role.contains("ROLE_") ? role : "ROLE_" + role;
            this.authorities.add(new Authority(authority));
        }
    }
    @Override
    public boolean equals(Object o){
        if(this == o) return true;
        if(o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id == user.id &&
                activated == user.activated &&
                Objects.equals(email, user.email) &&
                Objects.equals(password, user.password) &&
                Objects.equals(authorities, user.authorities);
    }

    @Override
    public int hashCode(){
        return Objects.hash(id, email, password, activated, authorities);
    }

    @Override
    public String toString(){
        return "User{id + " + id
                + ", email= " + email
                + ", userName=  " + userName
                + ", activated= " + activated
                + ", authorities= " + authorities
                + "}";
    }
}
