package com.url.shortner.authservice.user;

import com.url.shortner.authservice.core.entity.AuditableEntity;
import com.url.shortner.authservice.user.enums.UserAuthProvider;
import com.url.shortner.authservice.user.enums.UserRole;
import com.url.shortner.authservice.user.enums.UserStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "users")
public class User extends AuditableEntity {

    @Id
    @UuidGenerator(style = UuidGenerator.Style.TIME)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private final UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private final UserStatus status = UserStatus.ACTIVE;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true, unique = true)
    private String googleId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserAuthProvider authProvider;

    private User(String email, String password, String name, UserAuthProvider authProvider) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.authProvider = authProvider;
    }

    public static User createLocalUser(String email, String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        String generatedName = User.generateDefaultName(email);
        return new User(email, password, generatedName, UserAuthProvider.LOCAL);
    }

    public static User createGoogleUser(String email, String googleId) {
        if (googleId == null || googleId.isBlank()) {
            throw new IllegalArgumentException("Google Id cannot be null or empty");
        }
        String generatedName = User.generateDefaultName(email);
        var user = new User(email, null, generatedName, UserAuthProvider.GOOGLE);
        user.googleId = googleId;
        return user;
    }

    private static String generateDefaultName(String email) {
        if(email == null || !email.contains("@") || !email.contains(".")) {
            throw  new IllegalArgumentException("Invalid email");
        }
        return email.split("@")[0];
    }

}