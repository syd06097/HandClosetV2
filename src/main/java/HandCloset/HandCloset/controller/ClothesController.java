package HandCloset.HandCloset.controller;

import HandCloset.HandCloset.entity.Clothes;
import HandCloset.HandCloset.entity.Diary;
import HandCloset.HandCloset.security.jwt.util.IfLogin;
import HandCloset.HandCloset.security.jwt.util.LoginUserDto;
import HandCloset.HandCloset.security.jwt.util.UnauthorizedException;
import HandCloset.HandCloset.service.ClothesService;
import HandCloset.HandCloset.service.DiaryService;
import HandCloset.HandCloset.service.MemberService;
import HandCloset.HandCloset.utils.ImageProcessor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;


@RestController
@RequiredArgsConstructor
@Transactional
@RequestMapping("/api/clothing")
public class ClothesController {

    private final ClothesService clothesService;
    private final DiaryService diaryService;
    private final MemberService memberService;


    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Clothes> saveClothes(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category,
            @RequestParam("subcategory") String subcategory,
            @RequestParam("season") String season,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "color", required = false) String color,
            @IfLogin LoginUserDto loginUserDto) {

        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            Clothes clothes = new Clothes();
            MultipartFile processedImage = ImageProcessor.resizeImage(file, 200, 200);
            String imagePath = clothesService.saveImage(processedImage, loginUserDto.getMemberId());

            clothes.setImgpath(imagePath);
            clothes.setCategory(category);
            clothes.setSubcategory(subcategory);
            clothes.setSeason(season);
            clothes.setDescription(description);
            clothes.setColor(color);
            clothes.setMember(memberService.findMemberById(loginUserDto.getMemberId()));

            Clothes savedClothes = clothesService.saveClothes(clothes);
            return new ResponseEntity<>(savedClothes, HttpStatus.CREATED);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Clothes> updateClothes(
            @PathVariable Long id,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "subcategory", required = false) String subcategory,
            @RequestParam(value = "season", required = false) String season,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "color", required = false) String color,
            @IfLogin LoginUserDto loginUserDto) {

        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            Clothes clothes = clothesService.getClothes(id, loginUserDto.getMemberId());

            clothes.setCategory(category);
            clothes.setSubcategory(subcategory);
            clothes.setSeason(season);
            clothes.setDescription(description);
            clothes.setColor(color);
            clothes.setMember(memberService.findMemberById(loginUserDto.getMemberId()));

            Clothes updatedClothes = clothesService.saveClothes(clothes);
            return ResponseEntity.ok(updatedClothes);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Clothes> getClothes(
            @IfLogin LoginUserDto loginUserDto,
            @PathVariable Long id) {

        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            Clothes clothes = clothesService.getClothes(id, loginUserDto.getMemberId());
            return ResponseEntity.ok(clothes);
        }
    }

    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Integer> getTotalClothesCount(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            int clothesTotalCount = clothesService.getClothesCount(loginUserDto.getMemberId());
            return ResponseEntity.ok(clothesTotalCount);
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Clothes>> getAllClothes(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Clothes> clothesList = clothesService.getAllClothes(loginUserDto.getMemberId());
            return ResponseEntity.ok(clothesList);
        }
    }

    // ClothesDetail-삭제
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Void> deleteClothes(
            @IfLogin LoginUserDto loginUserDto,
            @PathVariable Long id) {

        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {

            try {
                Clothes clothes = clothesService.getClothes(id, loginUserDto.getMemberId());
                String imagePath = clothes.getImgpath();
                // 파일 경로 구분자 수정
                boolean isImageUsedByOtherClothes = clothesService.isImageUsedByOtherClothes(imagePath, loginUserDto.getMemberId(), id);

                // imagePath와 member로 해당 이미지 사용중인지 파악
                if (!isImageUsedByOtherClothes) {
                    // 파일 경로 구분자 수정
                    String modifiedImagePath = imagePath.replace("\\", "/");
                    Path imageFilePath = Paths.get(modifiedImagePath);

                    // 파일 시스템에서 이미지 삭제
                    Files.delete(imageFilePath);
                }

                List<Diary> referencingDiaries = diaryService.findDiariesByImageId(id, loginUserDto.getMemberId());
                for (Diary diary : referencingDiaries) {
                    diary.getImageIds().remove(id);

                    // 이미지 ID 목록이 비어 있다면 다이어리를 삭제
                    if (diary.getImageIds().isEmpty()) {
                        diaryService.deleteDiaryAndImage(diary.getId(), loginUserDto.getMemberId());
                    }
                }


                // 이미지 삭제가 성공한 경우에만 DB에서 데이터 삭제
                clothesService.deleteClothes(id, loginUserDto.getMemberId());
                return ResponseEntity.noContent().build();
            } catch (IOException e) {
                // 파일 삭제 실패 시 예외 처리
                e.printStackTrace();
                throw new RuntimeException("Failed to delete image and data.");
            }
        }
    }


    @GetMapping("/category")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Clothes>> getClothesByCategoryAndSubcategory(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory,
            @IfLogin LoginUserDto loginUserDto) {

        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Clothes> result;
            if ("전체".equals(category)) {
                result = clothesService.getAllClothes(loginUserDto.getMemberId());
            } else {
                result = clothesService.getClothesByCategoryAndSubcategory(category, subcategory, loginUserDto.getMemberId());
            }
            return ResponseEntity.ok(result);
        }
    }


    @GetMapping(value = "/images/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<byte[]> getClothesImage(
            @IfLogin LoginUserDto loginUserDto,
            @PathVariable Long id) throws IOException {

        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            Clothes clothes = clothesService.getClothes(id, loginUserDto.getMemberId());
            String imgpath = clothes.getImgpath();
            Path imagePath = Paths.get(imgpath);
            byte[] imageBytes = Files.readAllBytes(imagePath);

            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
        }
    }


    @GetMapping("/ids")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Long>> getAllClothesIds(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Long> clothesIds = clothesService.getAllClothes(loginUserDto.getMemberId())
                    .stream()
                    .map(Clothes::getId)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(clothesIds);
        }
    }


    @GetMapping("/category-item-count")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Map<String, Integer>> getCategoryItemCountForClothes(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            Map<String, Integer> itemCountMap = clothesService.getCategoryItemCountForClothes(loginUserDto.getMemberId());
            return ResponseEntity.ok(itemCountMap);
        }
    }


    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Map<String, Integer>> getSeasonStatistics(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            Map<String, Integer> statistics = clothesService.getSeasonStatistics(loginUserDto.getMemberId());
            return ResponseEntity.ok(statistics);
        }
    }

    @GetMapping("/top-items")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Clothes>> getTopItems(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Clothes> topItems = clothesService.getTopItems(loginUserDto.getMemberId());
            return ResponseEntity.ok(topItems);
        }
    }

    @GetMapping("/bottom-items")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Clothes>> getBottomItems(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Clothes> bottomItems = clothesService.getBottomItems(loginUserDto.getMemberId());
            return ResponseEntity.ok(bottomItems);
        }
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Clothes>> getFilteredClothes(@IfLogin LoginUserDto loginUserDto, @RequestParam String subcategory) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Clothes> filteredClothes = clothesService.getFilteredClothes(subcategory, loginUserDto.getMemberId());
            return ResponseEntity.ok(filteredClothes);
        }
    }

    @GetMapping("/recommendation")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Clothes>> getRecommendedClothes(@IfLogin LoginUserDto loginUserDto, @RequestParam("subcategories") List<String> subcategories) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Clothes> recommendedClothes = new ArrayList<>();

            for (String subcategory : subcategories) {
                String decodedSubcategory = null;
                try {
                    decodedSubcategory = URLDecoder.decode(subcategory, "UTF-8");
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }
                List<Clothes> clothes = clothesService.getRecommendedClothes(decodedSubcategory, loginUserDto.getMemberId());
                recommendedClothes.addAll(clothes);
            }

            return ResponseEntity.ok(recommendedClothes);
        }
    }

    @GetMapping("/recommendation2")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Clothes>> getRecommendedClothes2(@IfLogin LoginUserDto loginUserDto, @RequestParam("subcategories") List<String> subcategories) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Clothes> recommendedClothes = new ArrayList<>();

            for (String subcategory : subcategories) {
                String decodedSubcategory = null;
                try {
                    decodedSubcategory = URLDecoder.decode(subcategory, "UTF-8");
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }
                List<Clothes> clothes = clothesService.getRecommendedClothesAsc(decodedSubcategory, loginUserDto.getMemberId());
                recommendedClothes.addAll(clothes);
            }

            return ResponseEntity.ok(recommendedClothes);
        }
    }

    @GetMapping("/RandomRecommendation")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Clothes>> getRecommendedClothes4(@IfLogin LoginUserDto loginUserDto, @RequestParam("subcategories") List<String> subcategories) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Clothes> recommendedClothes = new ArrayList<>();

            for (String subcategory : subcategories) {
                String decodedSubcategory = null;
                try {
                    decodedSubcategory = URLDecoder.decode(subcategory, "UTF-8");
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }
                List<Clothes> clothes = clothesService.getRandomRecommendedClothes(decodedSubcategory, loginUserDto.getMemberId());
                recommendedClothes.addAll(clothes);
            }
            return ResponseEntity.ok(recommendedClothes);
        }
    }

    @GetMapping("/byImageIds")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Clothes>> getClothesByImageIds(@IfLogin LoginUserDto loginUserDto, @RequestParam List<Long> imageIds) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Clothes> clothesList = clothesService.getClothesByImageIds(imageIds, loginUserDto.getMemberId());
            return ResponseEntity.ok(clothesList);
        }
    }

    @ControllerAdvice
    public class GlobalExceptionHandler {
        @ExceptionHandler(UnauthorizedException.class)
        public ResponseEntity<String> handleUnauthorizedException(UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}