package HandCloset.HandCloset.repository;

import HandCloset.HandCloset.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findAllByDateAndMemberId(Date date, Long memberId);
//    List<Diary> findByIdAndMemberId(Long id, Long memberId);

    Optional<Diary> findByIdAndMemberId(Long id, Long memberId);
    List<Diary> findByMemberId(Long memberId);
    List<Diary> findAllByImageIdsContainingAndMemberId(Long imageId, Long memberId);
    void deleteByIdAndMemberId(Long id, Long memberId);
    List<Diary> findAllByImageIdsContaining(Long imageId);

    List<Diary> findAllByThumbnailpathAndMemberId(String thumbnailpath, Long memberId);
}