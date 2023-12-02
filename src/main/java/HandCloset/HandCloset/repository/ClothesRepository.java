package HandCloset.HandCloset.repository;

import HandCloset.HandCloset.entity.Clothes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClothesRepository extends JpaRepository<Clothes, Long> {
    List<Clothes> findByCategoryAndSubcategoryAndMemberId(String category, String subcategory, Long memberId);

    List<Clothes> findByCategoryAndMemberId(String category, Long memberId);

    List<Clothes> findBySubcategoryAndMemberId(String subcategory, Long memberId);


    Optional<Clothes> findByIdAndMemberId(Long id, Long memberId);

    List<Clothes> findByMemberId(Long memberId);

    void deleteByIdAndMemberId(Long id, Long memberId);

    List<Clothes> findTop5ByMemberIdOrderByWearcntDesc(Long memberId);

    List<Clothes> findTop5ByMemberIdOrderByCreatedateAsc(Long memberId);

    List<Clothes> findTop2BySubcategoryAndMemberIdOrderByWearcntDesc(String subcategory, Long memberId);

    List<Clothes> findTop2BySubcategoryAndMemberIdOrderByWearcntAsc(String subcategory, Long memberId);

    List<Clothes> findByIdInAndMemberId(List<Long> ids, Long memberId);

    @Query("SELECT c FROM Clothes c WHERE c.subcategory = :subcategory AND c.memberId = :memberId ORDER BY FUNCTION('RAND')")
    List<Clothes> getRandomRecommendedClothes(@Param("subcategory") String subcategory, @Param("memberId") Long memberId);

    void deleteByMemberId(Long memberId);
}