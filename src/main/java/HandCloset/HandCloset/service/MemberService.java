package HandCloset.HandCloset.service;

import HandCloset.HandCloset.entity.Member;
import HandCloset.HandCloset.entity.Role;
import HandCloset.HandCloset.repository.MemberRepository;
import HandCloset.HandCloset.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
    private final MemberRepository memberRepository;
    private final RoleRepository roleRepository;


    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다."));
    }

    @Transactional
    public Member addMember(Member member) {
        Optional<Role> userRole = roleRepository.findByName("ROLE_USER");
        member.addRole(userRole.get());
        Member saveMember = memberRepository.save(member);
        return saveMember;
    }


    public Optional<Member> getMember(Long memberId) {
        return memberRepository.findById(memberId);
    }

    //    @Transactional(readOnly = true)
//    public Optional<Member> getMember(String email){
//        return memberRepository.findByEmail(email);
//    }
    @Transactional
    public void deleteMember(Long memberId) {
        memberRepository.deleteById(memberId);
    }

    @Transactional
    public void updateProfile(Long memberId, String editedUserName, String editedGender) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));

        // 수정된 정보 업데이트
        member.setName(editedUserName);
        member.setGender(editedGender);

        // 저장
        memberRepository.save(member);
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }


    public Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
    }
}
