
package HandCloset.HandCloset.controller;

import HandCloset.HandCloset.entity.Clothes;
import HandCloset.HandCloset.entity.Diary;
import HandCloset.HandCloset.security.jwt.util.IfLogin;
import HandCloset.HandCloset.security.jwt.util.LoginUserDto;
import HandCloset.HandCloset.security.jwt.util.UnauthorizedException;
import HandCloset.HandCloset.service.ClothesService;
import HandCloset.HandCloset.service.DiaryService;
import org.springframework.beans.factory.annotation.Value;
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

import org.springframework.http.HttpHeaders;

import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

import HandCloset.HandCloset.utils.ImageProcessor;

@RestController
@RequestMapping("/api/clothing")
public class ClothesController {
    private final ClothesService clothesService;

    private final DiaryService diaryService;

    @Value("${upload.directory}")
    private String uploadDirectory;

    public ClothesController(ClothesService clothesService, DiaryService diaryService) {
        this.clothesService = clothesService;
        this.diaryService = diaryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public Clothes saveClothes(@RequestParam("file") MultipartFile file,
                               @RequestParam("category") String category,
                               @RequestParam("subcategory") String subcategory,
                               @RequestParam("season") String season,
                               @RequestParam(value = "description", required = false) String description,
                               @RequestParam(value = "color", required = false) String color,
                               @IfLogin LoginUserDto loginUserDto)
    {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            Clothes clothes = new Clothes();

            // 이미지 처리
            MultipartFile processedImage = ImageProcessor.resizeAndRemoveBackground(file);

            // 파일을 저장하고 저장된 경로를 DB에 저장합니다.
            String imagePath = clothesService.saveImage(processedImage, loginUserDto.getMemberId());
           // String imagePath = clothesService.saveImage(file, loginUserDto.getMemberId());


            clothes.setImgpath(imagePath);
            clothes.setCategory(category);
            clothes.setSubcategory(subcategory);
            clothes.setSeason(season);
            clothes.setDescription(description);
            clothes.setColor(color);


            clothes.setMemberId(loginUserDto.getMemberId());

            return clothesService.saveClothes(clothes);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public Clothes updateClothes(@PathVariable Long id,
                                 @RequestParam(value = "file", required = false) MultipartFile file,
                                 @RequestParam(value = "category", required = false) String category,
                                 @RequestParam(value = "subcategory", required = false) String subcategory,
                                 @RequestParam(value = "season", required = false) String season,
                                 @RequestParam(value = "description", required = false) String description,
                                 @RequestParam(value = "color", required = false) String color,
                                 @IfLogin LoginUserDto loginUserDto) {
//        Clothes clothes = clothesService.getClothes(id);
        Clothes clothes = clothesService.getClothes(id, loginUserDto.getMemberId());
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {

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
                String newImagePath = clothesService.saveImage(file, loginUserDto.getMemberId());
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

            if (color != null) {
                clothes.setColor(color);
            }

            clothes.setMemberId(loginUserDto.getMemberId());

//        if(loginUserDto != null){
//            clothes.setMemberId(loginUserDto.getMemberId());
//        }

            return clothesService.saveClothes(clothes);
        }

    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public Clothes getClothes(@IfLogin LoginUserDto loginUserDto,@PathVariable Long id) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {

            return clothesService.getClothes(id, loginUserDto.getMemberId());
        }

    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public List<Clothes> getAllClothes(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            System.out.println("getAllClothes 함수 실행");
            return clothesService.getAllClothes( loginUserDto.getMemberId());
        }

    }

    // ClothesDetail-삭제
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional //이미지 삭제와 DB 데이터 삭제를 트랜잭션으로 묶어서 처리.두 작업이 모두 성공해야만 삭제가 완료
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public void deleteClothes(@IfLogin LoginUserDto loginUserDto,@PathVariable Long id) {

        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {



        try {
            Clothes clothes = clothesService.getClothes(id, loginUserDto.getMemberId());
            String imagePath = clothes.getImgpath();
            // 파일 경로 구분자 수정
            String modifiedImagePath = imagePath.replace("\\", "/");
            Path imageFilePath = Paths.get(modifiedImagePath);

            // 파일 시스템에서 이미지 삭제
            Files.delete(imageFilePath);

            // 다이어리 엔트리에서 해당 의류 아이템의 ID를 참조하는 경우 삭제 처리

            List<Diary> referencingDiaries = diaryService.findDiariesByImageId(id,loginUserDto.getMemberId());
            for (Diary diary : referencingDiaries) {
                diary.getImageIds().remove(id);

                // 이미지 ID 목록이 비어 있다면 다이어리를 삭제
                if (diary.getImageIds().isEmpty()) {
                    diaryService.deleteDiary(diary.getId(),loginUserDto.getMemberId());
                }
            }


            // 이미지 삭제가 성공한 경우에만 DB에서 데이터 삭제
            clothesService.deleteClothes(id, loginUserDto.getMemberId());
        } catch (IOException e) {
            // 파일 삭제 실패 시 예외 처리
            e.printStackTrace();
            throw new RuntimeException("Failed to delete image and data.");
        }
    }
    }

    // CategoryItem-카테고리
    @GetMapping("/category")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public List<Clothes> getClothesByCategoryAndSubcategory(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory,
            @IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            if ("전체".equals(category)) {
                return clothesService.getAllClothes( loginUserDto.getMemberId());
            } else {
                return clothesService.getClothesByCategoryAndSubcategory(category, subcategory, loginUserDto.getMemberId());
            }
        }
    }

    // 파일 시스템에서 이미지 가져오기
    @GetMapping(value = "/images/{id}", produces = MediaType.IMAGE_JPEG_VALUE) //이미지의 경로를 통해 단일 이미지를 가져옴
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public byte[] getClothesImage(@IfLogin LoginUserDto loginUserDto,@PathVariable Long id) throws IOException {
        if (loginUserDto == null) {
           throw new UnauthorizedException("로그인이 필요합니다.");
      } else {
            System.out.println("getClothesImage 함수 실행");
            Clothes clothes = clothesService.getClothes(id, loginUserDto.getMemberId());
            //System.out.println(clothes);
            String imgpath = clothes.getImgpath();
            //System.out.println(imgpath);
            Path imagePath = Paths.get(imgpath);
            //System.out.println( Files.readAllBytes(imagePath));
            return Files.readAllBytes(imagePath);
        }

    }

    // CategoryItem-전체
    @GetMapping("/ids")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public List<Long> getAllClothesIds(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            System.out.println("getAllClothesIds 함수 호출");
            return clothesService.getAllClothes( loginUserDto.getMemberId()).stream()
                    .map(Clothes::getId)
                    .collect(Collectors.toList());
        }
    }

    // ItemHave
    @GetMapping("/category-item-count")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Map<String, Integer>> getCategoryItemCountForClothes(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            Map<String, Integer> itemCountMap = clothesService.getCategoryItemCountForClothes( loginUserDto.getMemberId());
            return ResponseEntity.ok(itemCountMap);
        }
    }

    // ItemSpring
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public Map<String, Integer> getSeasonStatistics(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            return clothesService.getSeasonStatistics( loginUserDto.getMemberId());
        }
    }

    // ItemFrequently
    @GetMapping("/top-items")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public List<Clothes> getTopItems(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            return clothesService.getTopItems( loginUserDto.getMemberId());
        }
    }

    // ItemNotRecently
    @GetMapping("/bottom-items")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public List<Clothes> getBottomItems(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            return clothesService.getBottomItems( loginUserDto.getMemberId());
        }
    }


    @GetMapping("/filter")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public List<Clothes> getFilteredClothes(@IfLogin LoginUserDto loginUserDto,@RequestParam String subcategory) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            return clothesService.getFilteredClothes(subcategory, loginUserDto.getMemberId());
        }
    }


    @GetMapping("/recommendation")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public List<Clothes> getRecommendedClothes(@IfLogin LoginUserDto loginUserDto,@RequestParam("subcategories") List<String> subcategories) {
        System.out.println("getRecommendedClothes");
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

            return recommendedClothes;
        }
    }

    @GetMapping("/recommendation2")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public List<Clothes> getRecommendedClothes2(@IfLogin LoginUserDto loginUserDto,@RequestParam("subcategories") List<String> subcategories) {
        System.out.println("getRecommendedClothes2");
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

            return recommendedClothes;
        }
    }
    @GetMapping("/RandomRecommendation")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public List<Clothes> getRecommendedClothes4(@IfLogin LoginUserDto loginUserDto,@RequestParam("subcategories") List<String> subcategories) {
        System.out.println("getRecommendedClothes4");
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
            System.out.println("랜덤 함수 호출 ");
            return recommendedClothes;
        }
    }

    @GetMapping("/byImageIds")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Clothes>> getClothesByImageIds(@IfLogin LoginUserDto loginUserDto,@RequestParam List<Long> imageIds) {
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