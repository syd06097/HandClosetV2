package HandCloset.HandCloset.config;

import HandCloset.HandCloset.entity.RefreshToken;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@EnableCaching
public class RedisConfig {

    // Redis 연결을 위한 ConnectionFactory를 생성하는 빈
    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        // Redis 서버 연결 설정
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration("localhost", 6379);
        // 추가적인 설정이 필요하다면 여기에 추가
        return new LettuceConnectionFactory(redisStandaloneConfiguration);
    }

    // Redis에 데이터를 저장하고 조회하기 위한 RedisTemplate을 생성하는 빈
    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        // RedisTemplate 생성
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        // 앞서 정의한 Redis 연결을 위한 ConnectionFactory를 설정
        template.setConnectionFactory(redisConnectionFactory());
        // 기본 Serializer를 JSON Serializer로 변경
        template.setDefaultSerializer(new GenericJackson2JsonRedisSerializer());
        // 추가적인 설정이 필요하다면 여기에 추가
        return template;
    }
}