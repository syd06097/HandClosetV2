package HandCloset.HandCloset.repository;

import HandCloset.HandCloset.entity.Clothes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
@Repository
public interface ClothesRepository extends JpaRepository<Clothes, Long> {
    List<Clothes> findByCategoryAndSubcategory(String category, String subcategory);

    List<Clothes> findByCategory(String category);

    List<Clothes> findBySubcategory(String subcategory);
    // "전체" 카테고리를 선택할 때 모든 이미지를 반환하는 메서드 추가
    List<Clothes> findAll();
    List<Clothes> findTop5ByOrderByWearcntDesc();

    List<Clothes> findTop5ByOrderByCreatedateAsc();

    List<Clothes> findTop2BySubcategoryOrderByWearcntDesc(String subcategory);

    List<Clothes> findTop2BySubcategoryOrderByWearcntAsc(String subcategory);

    @Query(value = "SELECT * FROM clothes WHERE subcategory = :subcategory ORDER BY RAND()", nativeQuery = true)
    List<Clothes> getRandomRecommendedClothes(@Param("subcategory") String subcategory);


    List<Clothes> findByIdIn(List<Long> ids); //이미지 아이디 목록에 해당하는 의류 아이템들 가져옴

}