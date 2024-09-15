package org.deck_builder.model;

public class UserDTO {
    private int userId;
    private String email;
    private String userName;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserName() { return userName;}

    public void setUserName(String userName) { this.userName = userName;}

    @Override
    public String toString() {
        return "UpdateUserProfileDTO{" +
                "email='" + email + '\'' +
                ", userName='" + userName +
                '}';
    }
}
