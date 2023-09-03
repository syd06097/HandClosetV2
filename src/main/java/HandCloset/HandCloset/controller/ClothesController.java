
package HandCloset.HandCloset.controller;

import HandCloset.HandCloset.entity.Clothes;
import HandCloset.HandCloset.entity.Diary;
import HandCloset.HandCloset.service.ClothesService;
import HandCloset.HandCloset.service.DiaryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.net.URLDecoder;
import org.springframework.http.HttpHeaders;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/clothing")
public class ClothesController {
    private final ClothesService clothesService;

    private final DiaryService diaryService;

    @Value("${upload.directory}")
    private String uploadDirectory;

    public ClothesController(ClothesService clothesService , DiaryService diaryService) {
        this.clothesService = clothesService;
        this.diaryService=diaryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Clothes saveClothes(@RequestParam("file") MultipartFile file,
                               @RequestParam("category") String category,
                               @RequestParam("subcategory") String subcategory,
                               @RequestParam("season") String season,
                               @RequestParam(value = "description", required = false) String description) {
        Clothes clothes = new Clothes();
        // 파일을 저장하고 저장된 경로를 DB에 저장합니다.
        String imagePath = clothesService.saveImage(file);
        clothes.setImgpath(imagePath);
        clothes.setCategory(category);
        clothes.setSubcategory(subcategory);
        clothes.setSeason(season);
        clothes.setDescription(description);
        return clothesService.saveClothes(clothes);
    }

    @PutMapping("/{id}")
    public Clothes updateClothes(@PathVariable Long id,
                                 @RequestParam(value = "file", required = false) MultipartFile file,
                                 @RequestParam(value = "category", required = false) String category,
                                 @RequestParam(value = "subcategory", required = false) String subcategory,
                                 @RequestParam(value = "season", required = false) String season,
                                 @RequestParam(value = "description", required = false) String description) {
        Clothes clothes = clothesService.getClothes(id);

        if (clothes == null) {
            throw new EntityNotFoundException("Clothes entity with id " + id + " does not exist.");
        }

        if (file != null) {
            // 기존 이미지 삭제
            String imagePath = clothes.getImgpath();
            String modifiedImagePath = imagePath.replace("\\", "/");
            Path imageFilePath = Paths.get(modifiedImagePath);
            try {
                Files.delete(imageFilePath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete image.");
            }

            // 새로운 이미지 저장
            String newImagePath = clothesService.saveImage(file);
            clothes.setImgpath(newImagePath);
        }

        if (category != null) {
            clothes.setCategory(category);
        }

        if (subcategory != null) {
            clothes.setSubcategory(subcategory);
        }

        if (season != null) {
            clothes.setSeason(season);
        }

        if (description != null) {
            clothes.setDescription(description);
        }

        return clothesService.saveClothes(clothes);
    }

    @GetMapping("/{id}")
    public Clothes getClothes(@PathVariable Long id) {
        return clothesService.getClothes(id);
    }

    @GetMapping
    public List<Clothes> getAllClothes() {
        return clothesService.getAllClothes();
    }

    // ClothesDetail-삭제
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional //이미지 삭제와 DB 데이터 삭제를 트랜잭션으로 묶어서 처리.두 작업이 모두 성공해야만 삭제가 완료
    public void deleteClothes(@PathVariable Long id) {
        try {
            Clothes clothes = clothesService.getClothes(id);
            String imagePath = clothes.getImgpath();
            // 파일 경로 구분자 수정
            String modifiedImagePath = imagePath.replace("\\", "/");
            Path imageFilePath = Paths.get(modifiedImagePath);

            // 파일 시스템에서 이미지 삭제
            Files.delete(imageFilePath);

            // 다이어리 엔트리에서 해당 의류 아이템의 ID를 참조하는 경우 삭제 처리

            List<Diary> referencingDiaries = diaryService.findDiariesByImageId(id);
            for (Diary diary : referencingDiaries) {
                diary.getImageIds().remove(id);

                // 이미지 ID 목록이 비어 있다면 다이어리를 삭제
                if (diary.getImageIds().isEmpty()) {
                    diaryService.deleteDiary(diary.getId());
                }
            }



            // 이미지 삭제가 성공한 경우에만 DB에서 데이터 삭제
            clothesService.deleteClothes(id);
        } catch (IOException e) {
            // 파일 삭제 실패 시 예외 처리
            e.printStackTrace();
            throw new RuntimeException("Failed to delete image and data.");
        }
    }
    // CategoryItem-카테고리
    @GetMapping("/category")
    public List<Clothes> getClothesByCategoryAndSubcategory(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory) {

        if ("전체".equals(category)) {
            return clothesService.getAllClothes();
        } else {
            return clothesService.getClothesByCategoryAndSubcategory(category, subcategory);
        }
    }
    // 파일 시스템에서 이미지 가져오기 
    @GetMapping(value = "/images/{id}", produces = MediaType.IMAGE_JPEG_VALUE) //이미지의 경로를 통해 단일 이미지를 가져옴
    public byte[] getClothesImage(@PathVariable Long id) throws IOException {
        Clothes clothes = clothesService.getClothes(id);
        String imgpath = clothes.getImgpath();
        Path imagePath = Paths.get(imgpath);
        return Files.readAllBytes(imagePath);
    }

    // CategoryItem-전체
    @GetMapping("/ids")
    public List<Long> getAllClothesIds() {
        return clothesService.getAllClothes().stream()
                .map(Clothes::getId)
                .collect(Collectors.toList());
    }

    // ItemHave
    @GetMapping("/category-item-count")
    public ResponseEntity<Map<String, Integer>> getCategoryItemCountForClothes() {
        Map<String, Integer> itemCountMap = clothesService.getCategoryItemCountForClothes();
        return ResponseEntity.ok(itemCountMap);
    }

    // ItemSpring
    @GetMapping("/statistics")
    public Map<String, Integer> getSeasonStatistics() {
        return clothesService.getSeasonStatistics();
    }

    // ItemFrequently
    @GetMapping("/top-items")
    public List<Clothes> getTopItems() {
        return clothesService.getTopItems();
    }

    // ItemNotRecently
    @GetMapping("/bottom-items")
    public List<Clothes> getBottomItems() {
        return clothesService.getBottomItems();
    }



    @GetMapping("/filter")
    public List<Clothes> getFilteredClothes(@RequestParam String subcategory) {
        return clothesService.getFilteredClothes(subcategory);
    }


    @GetMapping("/recommendation")
    public List<Clothes> getRecommendedClothes(@RequestParam("subcategories") List<String> subcategories) {
        List<Clothes> recommendedClothes = new ArrayList<>();

        for (String subcategory : subcategories) {
            String decodedSubcategory = null;
            try {
                decodedSubcategory = URLDecoder.decode(subcategory, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }
            List<Clothes> clothes = clothesService.getRecommendedClothes(decodedSubcategory);
            recommendedClothes.addAll(clothes);
        }

        return recommendedClothes;
    }
    @GetMapping("/recommendation2")
    public List<Clothes> getRecommendedClothes2(@RequestParam("subcategories") List<String> subcategories) {
        List<Clothes> recommendedClothes = new ArrayList<>();

        for (String subcategory : subcategories) {
            String decodedSubcategory = null;
            try {
                decodedSubcategory = URLDecoder.decode(subcategory, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }
            List<Clothes> clothes = clothesService.getRecommendedClothesAsc(decodedSubcategory);
            recommendedClothes.addAll(clothes);
        }

        return recommendedClothes;
    }
    @GetMapping("/byImageIds")
    public ResponseEntity<List<Clothes>> getClothesByImageIds(@RequestParam List<Long> imageIds) {
        List<Clothes> clothesList = clothesService.getClothesByImageIds(imageIds);
        return ResponseEntity.ok(clothesList);
    }
}