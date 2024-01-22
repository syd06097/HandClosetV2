package HandCloset.HandCloset.controller;

import HandCloset.HandCloset.entity.Member;
import HandCloset.HandCloset.entity.RefreshToken;
import HandCloset.HandCloset.entity.Role;
import HandCloset.HandCloset.dto.*;
import HandCloset.HandCloset.security.jwt.util.IfLogin;
import HandCloset.HandCloset.security.jwt.util.JwtTokenizer;
import HandCloset.HandCloset.security.jwt.util.LoginUserDto;
import HandCloset.HandCloset.security.jwt.util.UnauthorizedException;
import HandCloset.HandCloset.service.MemberManagementService;
import HandCloset.HandCloset.service.MemberService;
import HandCloset.HandCloset.service.RefreshTokenService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Validated
@Transactional
@RequestMapping("/members")
public class MemberController {

    private final JwtTokenizer jwtTokenizer;
    private final MemberService memberService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final MemberManagementService memberManagementService;
    private final RedisTemplate<String, Object> redisTemplate;

    // ResponseEntity는 Spring에서 HTTP 응답을 나타내는 클래스
    // 클라이언트에게 전송할 응답 데이터와 HTTP 상태 코드를 함께 제공
    // 이 클래스를 사용하는 이유는 다양한 HTTP 응답을 생성하고 클라이언트에게 전달할 수 있기 때문

    // 회원 가입 엔드포인트
    @PostMapping("/signup")
    public ResponseEntity signup(@RequestBody @Valid MemberSignupDto memberSignupDto, BindingResult bindingResult) {
        // 유효성 검사 실패 시 BAD_REQUEST 반환
        // MemberSignupDto 객체에 대한 유효성 검사 결과
        if (bindingResult.hasErrors()) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        // MemberSignupDto를 Member 엔티티로 변환하여 저장
        Member member = new Member();
        member.setName(memberSignupDto.getName());
        member.setEmail(memberSignupDto.getEmail());
        member.setPassword(passwordEncoder.encode(memberSignupDto.getPassword()));
        member.setGender(memberSignupDto.getGender());

        Member saveMember = memberService.addMember(member);
        // 회원 가입 성공 시 응답
        MemberSignupResponseDto memberSignupResponse = new MemberSignupResponseDto();
        memberSignupResponse.setMemberId(saveMember.getMemberId());
        memberSignupResponse.setName(saveMember.getName());
        memberSignupResponse.setRegdate(saveMember.getRegdate());
        memberSignupResponse.setEmail(saveMember.getEmail());


        return new ResponseEntity(memberSignupResponse, HttpStatus.CREATED);
    }

    // 로그인 엔드포인트
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid MemberLoginDto loginDto, BindingResult bindingResult) {
        // 유효성 검사 실패 시 BAD_REQUEST 반환
        if (bindingResult.hasErrors()) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }

        // 이메일로 회원 조회
        Member member = memberService.findByEmail(loginDto.getEmail());
        // 비밀번호 검증
        if (!passwordEncoder.matches(loginDto.getPassword(), member.getPassword())) {
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }
        // JWT 토큰 생성 및 응답
        List<String> roles = member.getRoles().stream().map(Role::getName).collect(Collectors.toList());
        String accessToken = jwtTokenizer.createAccessToken(member.getMemberId(), member.getEmail(), member.getName(), roles);
        String refreshToken = jwtTokenizer.createRefreshToken(member.getMemberId(), member.getEmail(), member.getName(), roles);


        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setValue(refreshToken);
        refreshTokenEntity.setMemberId(member.getMemberId());
        refreshTokenService.addRefreshToken(refreshTokenEntity);

        MemberLoginResponseDto loginResponse = MemberLoginResponseDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .memberId(member.getMemberId())
                .nickname(member.getName())
                .roles(member.getRoles())
                .build();
        return new ResponseEntity(loginResponse, HttpStatus.OK);
    }

    // 로그아웃 엔드포인트
    @DeleteMapping("/logout")
    public ResponseEntity logout(@RequestBody RefreshTokenDto refreshTokenDto) {
        // RefreshToken 삭제
        refreshTokenService.deleteRefreshToken(refreshTokenDto.getRefreshToken());
        return new ResponseEntity(HttpStatus.OK);
    }

    // RefreshToken을 이용하여 새로운 AccessToken을 발급하는 엔드포인트
    @PostMapping("/refreshToken")
    public ResponseEntity requestRefresh(@RequestBody RefreshTokenDto refreshTokenDto) {
        // 주어진 RefreshToken 값으로 저장된 RefreshToken 엔티티를 찾음
        Optional<RefreshToken> optionalRefreshToken = refreshTokenService.findRefreshToken(refreshTokenDto.getRefreshToken());

        // RefreshToken이 존재하는 경우
        if (optionalRefreshToken.isPresent()) {
            // RefreshToken 엔티티를 가져옴
            RefreshToken refreshToken = optionalRefreshToken.get();
            // RefreshToken에서 정보를 추출
            Claims claims = jwtTokenizer.parseRefreshToken(refreshToken.getValue());

            // 추출한 정보에서 memberId를 얻어옴
            Long memberId = Long.valueOf((Integer) claims.get("memberId"));
            // memberId를 사용하여 해당 멤버 정보를 데이터베이스에서 조회, 멤버가 없을 경우 예외를 던짐
            Member member = memberService.getMember(memberId).orElseThrow(() -> new IllegalArgumentException("Member not found"));

            // 추출한 정보에서 권한 정보를 얻어옴
            List<String> roles = (List) claims.get("roles");
            // 새로운 AccessToken을 생성
            String accessToken = jwtTokenizer.createAccessToken(memberId, claims.getSubject(), member.getName(), roles);

            // 새로운 응답을 생성하여 반환
            MemberLoginResponseDto loginResponse = MemberLoginResponseDto.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshTokenDto.getRefreshToken())
                    .memberId(member.getMemberId())
                    .nickname(member.getName())
                    .build();

            return new ResponseEntity(loginResponse, HttpStatus.OK);
        } else {
            // RefreshToken이 유효하지 않거나 존재하지 않는 경우 UNAUTHORIZED 상태 코드 반환
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }
    }

    // 사용자 정보 조회 엔드포인트
    @GetMapping("/info")
    public ResponseEntity userinfo(@IfLogin LoginUserDto loginUserDto) {
        // 로그인된 사용자 정보 조회
        Member member = memberService.findByEmail(loginUserDto.getEmail());
        return new ResponseEntity(member, HttpStatus.OK);
    }

    // 회원 탈퇴 엔드포인트
    @DeleteMapping("/{memberId}")
    public ResponseEntity deleteMember(@PathVariable Long memberId, @RequestBody RefreshTokenDto refreshTokenDto) {
        try {
            refreshTokenService.deleteRefreshToken(refreshTokenDto.getRefreshToken());
            memberManagementService.deleteMemberAndRelatedData(memberId);


            return new ResponseEntity(HttpStatus.OK);
        } catch (EmptyResultDataAccessException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found");
        }
    }

    // 프로필 업데이트 엔드포인트
    @PutMapping("/update")
    public ResponseEntity<String> updateProfile(
            @RequestBody UpdateProfileRequestDto updateProfileRequestDto) {
        try {

            memberService.updateProfile(
                    updateProfileRequestDto.getMemberId(),
                    updateProfileRequestDto.getEditedUserName(),
                    updateProfileRequestDto.getEditedGender()
            );

            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update profile");
        }
    }

    // 관리자 권한을 가진 사용자에게만 회원 목록 조회 엔드포인트
    @GetMapping("/getMemberList")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Member>> getMemberList(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Member> memberList = memberService.getAllMembers();
            return new ResponseEntity<>(memberList, HttpStatus.OK);
        }
    }
}

