
package HandCloset.HandCloset.service;
import HandCloset.HandCloset.entity.Diary;
import org.springframework.beans.factory.annotation.Value;
import HandCloset.HandCloset.entity.Clothes;
import HandCloset.HandCloset.repository.ClothesRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;


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
    @Transactional(readOnly = true)
    public Clothes getClothes(Long id, Long memberId) {
        return clothesRepository.findByIdAndMemberId(id, memberId).orElse(null);
    }
    @Transactional(readOnly = true)
    public List<Clothes> getAllClothes( Long memberId) {
        return clothesRepository.findByMemberId(memberId);
    }

    public void deleteClothes(Long id,Long memberId) {
        try {
            clothesRepository.deleteByIdAndMemberId(id,memberId);
        } catch (EmptyResultDataAccessException e) {
            // 요청한 id에 해당하는 Clothes 엔티티가 존재하지 않는 경우
            throw new EntityNotFoundException("Clothes entity with id " + id + " does not exist.");
        }
    }
    //다른 클래스에서 활용하는 메서드
    public void deleteClothesAndImage(Long id,Long memberId) {
        try {
            try {
                Clothes clothes = clothesRepository.findByIdAndMemberId(id, memberId).orElse(null);
                String imagePath = clothes.getImgpath();
                // 파일 경로 구분자 수정
                String modifiedImagePath = imagePath.replace("\\", "/");
                Path imageFilePath = Paths.get(modifiedImagePath);

                // 파일 시스템에서 이미지 삭제
                Files.delete(imageFilePath);

            } catch (IOException e) {
                // 파일 삭제 실패 시 예외 처리
                e.printStackTrace();
                throw new RuntimeException("Failed to delete image and data.");
            }
            clothesRepository.deleteByIdAndMemberId(id,memberId);
        } catch (EmptyResultDataAccessException e) {
            // 요청한 id에 해당하는 Clothes 엔티티가 존재하지 않는 경우
            throw new EntityNotFoundException("Clothes entity with id " + id + " does not exist.");
        }
    }
    public void deleteAllClothes(Long memberId) {
        try {
            List<Clothes> clothesList = clothesRepository.findByMemberId(memberId);

            for (Clothes clothes : clothesList) {
                String imagePath = clothes.getImgpath();
                // 파일 경로 구분자 수정
                String modifiedImagePath = imagePath.replace("\\", "/");
                Path imageFilePath = Paths.get(modifiedImagePath);
                Files.delete(imageFilePath);
            }

            clothesRepository.deleteByMemberId(memberId);
        } catch (IOException e) {
            // 파일 삭제 실패 시 예외 처리
            e.printStackTrace();
            throw new RuntimeException("Failed to delete");
        }
    }

    @Transactional(readOnly = true)
    public int getClothesCount(Long memberId) {
        return clothesRepository.countByMemberId(memberId);
    }

    @Transactional(readOnly = true)
    public List<Clothes> getClothesByCategory(String category,Long memberId) {
        return clothesRepository.findByCategoryAndMemberId(category,memberId);
    }
    @Transactional(readOnly = true)
    public List<Clothes> getClothesBySubcategory(String subcategory,Long memberId) {
        return clothesRepository.findBySubcategoryAndMemberId(subcategory,memberId);
    }
    @Transactional(readOnly = true)
    public List<Clothes> getClothesByCategoryAndSubcategory(String category, String subcategory,Long memberId) {
        return clothesRepository.findByCategoryAndSubcategoryAndMemberId(category, subcategory,memberId);
    }
    public String saveImage(MultipartFile file, Long memberId) {
        try {
            // 사용자별 디렉토리 생성
            String userDirectory = uploadDirectory + File.separator + "member_" + memberId;
            File directory = new File(userDirectory);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 이미지 파일 경로 생성
            String filePath = userDirectory + File.separator + file.getOriginalFilename();
            file.transferTo(new File(filePath));
            return filePath;
        } catch (IOException e) {
            // 예외 처리
            e.printStackTrace();
            return null;
        }
    }

    @Transactional(readOnly = true)
    public Map<String, Integer> getCategoryItemCountForClothes(Long memberId) {
        List<Clothes> allClothes = clothesRepository.findByMemberId(memberId);
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
    @Transactional(readOnly = true)
    public Map<String, Integer> getSeasonStatistics(Long memberId) {
        List<Clothes> clothesList = clothesRepository.findByMemberId(memberId);
        Map<String, Integer> statistics = new HashMap<>();

        for (Clothes clothes : clothesList) {
            String[] seasons = clothes.getSeason().split(",");
            for (String season : seasons) {
                statistics.put(season, statistics.getOrDefault(season, 0) + 1);
            }
        }

        return statistics;
    }
    @Transactional(readOnly = true)
    public List<Clothes> getTopItems(Long memberId) {
        return clothesRepository.findTop5ByMemberIdOrderByWearcntDesc(memberId);
    }

    @Transactional(readOnly = true)
    public List<Clothes> getBottomItems(Long memberId) {
        return clothesRepository.findTop5ByMemberIdOrderByCreatedateAsc(memberId);
    }
    ///
    @Transactional(readOnly = true)
    public List<Clothes> getFilteredClothes(String subcategory, Long memberId) {
        return clothesRepository.findBySubcategoryAndMemberId(subcategory, memberId);
    }
    @Transactional(readOnly = true)
    public List<Clothes> getRecommendedClothes(String subcategory, Long memberId) {
        return clothesRepository.findTop2BySubcategoryAndMemberIdOrderByWearcntDesc(subcategory, memberId);
    }
    @Transactional(readOnly = true)
    public List<Clothes> getRecommendedClothesAsc(String subcategory, Long memberId) {
        return clothesRepository.findTop2BySubcategoryAndMemberIdOrderByCreatedateAsc(subcategory, memberId);
    }
    @Transactional(readOnly = true)
    public List<Clothes> getRandomRecommendedClothes(String subcategory, Long memberId) {
        return clothesRepository.getRandomRecommendedClothes(subcategory, memberId);
    }
    public void updateWearCountAndCreateDateOnCreate(Long imageId, Date date, Long memberId) {
        Optional<Clothes> optionalClothes = clothesRepository.findByIdAndMemberId(imageId, memberId);
        optionalClothes.ifPresent(clothes -> {
            clothes.setWearcnt(clothes.getWearcnt() + 1);
            Date existingCreatedate = clothes.getCreatedate();
            if (existingCreatedate == null || date.after(existingCreatedate)) {
                clothes.setCreatedate(date); // 최근의 날짜인 경우에만 createdate를 업데이트 시킴
            }
            clothesRepository.save(clothes);
        });
    }

    public void updateWearCountAndCreateDateOnDelete(Long imageId, Date date, Long memberId) {
        Optional<Clothes> optionalClothes = clothesRepository.findByIdAndMemberId(imageId, memberId);
        optionalClothes.ifPresent(clothes -> {
            clothes.setWearcnt(clothes.getWearcnt() - 1);
            Date existingCreatedate = clothes.getCreatedate();
            clothes.setCreatedate(date); // 최근의 날짜인 경우에만 createdate를 업데이트 시킴

            clothesRepository.save(clothes);
        });
    }
    @Transactional(readOnly = true)
    public List<Clothes> getClothesByImageIds(List<Long> imageIds, Long memberId) {
        return clothesRepository.findByIdInAndMemberId(imageIds, memberId);
    }
}