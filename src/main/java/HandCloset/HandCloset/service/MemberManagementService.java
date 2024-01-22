package HandCloset.HandCloset.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class MemberManagementService {

    private final ClothesService clothesService;
    private final DiaryService diaryService;
    private final MemberService memberService;

    @Transactional
    public void deleteMemberAndRelatedData(Long memberId) {
        clothesService.deleteAllClothes(memberId);
        diaryService.deleteAllDiaries(memberId);
        memberService.deleteMember(memberId);
    }
}
