package HandCloset.HandCloset.repository;

import HandCloset.HandCloset.entity.Diary;
import HandCloset.HandCloset.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findAllByDateAndMember(Date date, Member member);
//    List<Diary> findByIdAndMemberId(Long id, Long memberId);

    Optional<Diary> findByIdAndMember(Long id, Member member);

    List<Diary> findByMember(Member member);

    List<Diary> findAllByImageIdsContainingAndMember(Long imageId, Member member);

    void deleteByIdAndMember(Long id, Member member);

    List<Diary> findAllByImageIdsContaining(Long imageId);

    List<Diary> findAllByThumbnailpathAndMember(String thumbnailpath, Member member);

    void deleteByMember(Member member);

    int countByMember(Member member);


}