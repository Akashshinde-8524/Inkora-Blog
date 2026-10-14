package com.inkora.service;

import com.inkora.dto.request.ProfileUpdateRequest;
import com.inkora.dto.response.UserProfileResponse;
import com.inkora.entity.User;
import com.inkora.enums.BlogStatus;
import com.inkora.exception.ResourceNotFoundException;
import com.inkora.repository.BlogRepository;
import com.inkora.repository.FollowRepository;
import com.inkora.repository.UserRepository;
import com.inkora.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@SuppressWarnings("null")
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final BlogRepository blogRepository;

    public UserService(UserRepository userRepository,
                       FollowRepository followRepository,
                       BlogRepository blogRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
        this.blogRepository = blogRepository;
    }

    @Transactional
    public UserProfileResponse updateProfile(ProfileUpdateRequest request, UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        user.setDisplayName(request.getDisplayName().trim());
        user.setBio(request.getBio() != null ? request.getBio().trim() : null);
        user.setProfileImageUrl(request.getProfileImageUrl());

        User updated = userRepository.save(user);
        return mapToProfileResponse(updated, currentUser);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(String username, UserPrincipal currentUser) {
        User user = userRepository.findByUsername(username.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        return mapToProfileResponse(user, currentUser);
    }

    private UserProfileResponse mapToProfileResponse(User user, UserPrincipal currentUser) {
        long followersCount = followRepository.countByFollowing(user);
        long followingCount = followRepository.countByFollower(user);
        long blogsCount = blogRepository.countByAuthorAndStatus(user, BlogStatus.PUBLISHED);

        boolean isFollowing = false;
        if (currentUser != null && !currentUser.getId().equals(user.getId())) {
            User current = userRepository.findById(currentUser.getId()).orElse(null);
            if (current != null) {
                isFollowing = followRepository.existsByFollowerAndFollowing(current, user);
            }
        }

        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .bio(user.getBio())
                .profileImageUrl(user.getProfileImageUrl())
                .followersCount(followersCount)
                .followingCount(followingCount)
                .blogsCount(blogsCount)
                .isFollowing(isFollowing)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
