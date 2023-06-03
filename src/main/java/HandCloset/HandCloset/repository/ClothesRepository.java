package HandCloset.HandCloset.repository;

import HandCloset.HandCloset.entity.Clothes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ClothesRepository extends JpaRepository<Clothes, Long> {
    List<Clothes> findByCategoryAndSubcategory(String category, String subcategory);

    List<Clothes> findByCategory(String category);

    List<Clothes> findBySubcategory(String subcategory);
    // "전체" 카테고리를 선택할 때 모든 이미지를 반환하는 메서드 추가
    List<Clothes> findAll();

    List<Clothes> findTop2BySubcategoryOrderByWearcntDesc(String subcategory);

}