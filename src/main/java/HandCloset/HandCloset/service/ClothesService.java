
package HandCloset.HandCloset.service;
import org.springframework.beans.factory.annotation.Value;
import HandCloset.HandCloset.entity.Clothes;
import HandCloset.HandCloset.repository.ClothesRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class ClothesService {
    @Value("${upload.directory}")
    private String uploadDirectory;
    private final ClothesRepository clothesRepository;

    public ClothesService(ClothesRepository clothesRepository) {
        this.clothesRepository = clothesRepository;
    }

    public Clothes saveClothes(Clothes clothes) {
        return clothesRepository.save(clothes);
    }

    public Clothes getClothes(Long id) {
        return clothesRepository.findById(id).orElse(null);
    }

    public List<Clothes> getAllClothes() {
        return clothesRepository.findAll();
    }

    public void deleteClothes(Long id) {
        clothesRepository.deleteById(id);
    }

    public List<Clothes> getClothesByCategory(String category) {
        return clothesRepository.findByCategory(category);
    }

    public List<Clothes> getClothesBySubcategory(String subcategory) {
        return clothesRepository.findBySubcategory(subcategory);
    }

    public List<Clothes> getClothesByCategoryAndSubcategory(String category, String subcategory) {
        return clothesRepository.findByCategoryAndSubcategory(category, subcategory);
    }
    public String saveImage(MultipartFile file) {
        try {
            // 이미지를 파일 시스템에 저장하고 저장된 경로를 반환합니다.
            String filePath = uploadDirectory + File.separator + file.getOriginalFilename();
            file.transferTo(new File(filePath));
            return filePath;
        } catch (IOException e) {
            // 예외 처리
            e.printStackTrace();
            return null;
        }
    }


    public Map<String, Integer> getCategoryItemCountForClothes() {
        List<Clothes> allClothes = clothesRepository.findAll();
        Map<String, Integer> itemCountMap = new HashMap<>();

        for (Clothes clothes : allClothes) {
            String category = clothes.getCategory();
            String subcategory = clothes.getSubcategory();
            String categoryKey = category + "-" + subcategory;
            itemCountMap.put(categoryKey, itemCountMap.getOrDefault(categoryKey, 0) + 1);
        }

        return itemCountMap;
    }

    ///

    public Map<String, Integer> getSeasonStatistics() {
        List<Clothes> clothesList = clothesRepository.findAll();
        Map<String, Integer> statistics = new HashMap<>();

        for (Clothes clothes : clothesList) {
            String[] seasons = clothes.getSeason().split(",");
            for (String season : seasons) {
                statistics.put(season, statistics.getOrDefault(season, 0) + 1);
            }
        }

        return statistics;
    }
    public List<Clothes> getTopItems() {
        return clothesRepository.findTop5ByOrderByWearcntDesc();
    }


    public List<Clothes> getBottomItems() {
        return clothesRepository.findTop5ByOrderByCreatedateAsc();
    }
    ///
    public List<Clothes> getFilteredClothes(String subcategory) {
        return clothesRepository.findBySubcategory(subcategory);
    }

    public List<Clothes> getRecommendedClothes(String subcategory) {
        return clothesRepository.findTop2BySubcategoryOrderByWearcntDesc(subcategory);
    }
}