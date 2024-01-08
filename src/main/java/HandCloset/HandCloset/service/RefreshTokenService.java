package HandCloset.HandCloset.service;

import HandCloset.HandCloset.entity.RefreshToken;
import HandCloset.HandCloset.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.util.Optional;

//@Service
//@RequiredArgsConstructor
//public class RefreshTokenService {
//    private final RefreshTokenRepository refreshTokenRepository;
//
//    @Transactional
//    public RefreshToken addRefreshToken(RefreshToken refreshToken) {
//        return refreshTokenRepository.save(refreshToken);
//    }
//
//    @Transactional
//    public void deleteRefreshToken(String refreshToken) {
//        refreshTokenRepository.findByValue(refreshToken).ifPresent(refreshTokenRepository::delete);
//    }
//
//    @Transactional(readOnly = true)
//    public Optional<RefreshToken> findRefreshToken(String refreshToken) {
//        return refreshTokenRepository.findByValue(refreshToken);
//    }
//}

// Redis에는 refreshToken이라는 Key로 JSON 형태로 Serialize된 객체가 저장되고, 필요할 때마다 Redis에서 가져오거나 삭제하는 방식으로 동작
// Redis는 캐싱의 역할을 수행하며 데이터베이스에 대한 부하를 줄여주는 역할
@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Transactional
    public RefreshToken addRefreshToken(RefreshToken refreshToken) {
        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);

        // Redis에 저장
        redisTemplate.opsForValue().set("refreshToken:" + savedToken.getValue(), savedToken);

        return savedToken;
    }

    @Transactional
    public void deleteRefreshToken(String refreshToken) {
        // Redis에서도 삭제
        redisTemplate.delete("refreshToken:" + refreshToken);
        refreshTokenRepository.findByValue(refreshToken).ifPresent(refreshTokenRepository::delete);
    }

    @Transactional(readOnly = true)
    public Optional<RefreshToken> findRefreshToken(String refreshToken) {
        // Redis에서 RefreshToken 조회
        RefreshToken refreshTokenEntity = (RefreshToken) redisTemplate.opsForValue().get("refreshToken:" + refreshToken);
        if (refreshTokenEntity != null) {
            return Optional.of(refreshTokenEntity);
        } else {
            return refreshTokenRepository.findByValue(refreshToken);
        }
    }
}