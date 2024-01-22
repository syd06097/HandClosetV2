
package HandCloset.HandCloset.service;

import HandCloset.HandCloset.entity.Diary;
import HandCloset.HandCloset.entity.Member;
import HandCloset.HandCloset.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClothesService {
    @Value("${upload.directory}")
    private String uploadDirectory;
    private final ClothesRepository clothesRepository;

    private final MemberRepository memberRepository;


    @Transactional
    public Clothes saveClothes(Clothes clothes) {
        return clothesRepository.save(clothes);
    }

    public Clothes getClothes(Long id, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return clothesRepository.findByIdAndMember(id, member).orElse(null);
    }

    public List<Clothes> getAllClothes(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return clothesRepository.findByMember(member);
    }

    @Transactional
    public void deleteClothes(Long id, Long memberId) {
        try {
            Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
            clothesRepository.deleteByIdAndMember(id, member);
        } catch (EmptyResultDataAccessException e) {
            // 요청한 id에 해당하는 Clothes 엔티티가 존재하지 않는 경우
            throw new EntityNotFoundException("Clothes entity with id " + id + " does not exist.");
        }
    }

    @Transactional
    public void deleteClothesAndImage(Long id, Long memberId) {
        try {
            Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
            try {

                Clothes clothes = clothesRepository.findByIdAndMember(id, member).orElse(null);
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
            clothesRepository.deleteByIdAndMember(id, member);
        } catch (EmptyResultDataAccessException e) {
            // 요청한 id에 해당하는 Clothes 엔티티가 존재하지 않는 경우
            throw new EntityNotFoundException("Clothes entity with id " + id + " does not exist.");
        }
    }

    @Transactional
    public void deleteAllClothes(Long memberId) {
        try {
            Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
            List<Clothes> clothesList = clothesRepository.findByMember(member);

            for (Clothes clothes : clothesList) {
                String imagePath = clothes.getImgpath();
                // 파일 경로 구분자 수정
                String modifiedImagePath = imagePath.replace("\\", "/");
                Path imageFilePath = Paths.get(modifiedImagePath);
                Files.delete(imageFilePath);
            }

            clothesRepository.deleteByMember(member);
        } catch (IOException e) {
            // 파일 삭제 실패 시 예외 처리
            e.printStackTrace();
            throw new RuntimeException("Failed to delete");
        }
    }


    public int getClothesCount(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return clothesRepository.countByMember(member);
    }


    public List<Clothes> getClothesByCategory(String category, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return clothesRepository.findByCategoryAndMember(category, member);
    }

    public List<Clothes> getClothesBySubcategory(String subcategory, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return clothesRepository.findBySubcategoryAndMember(subcategory, member);
    }

    public List<Clothes> getClothesByCategoryAndSubcategory(String category, String subcategory, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return clothesRepository.findByCategoryAndSubcategoryAndMember(category, subcategory, member);
    }

    @Transactional
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


    public Map<String, Integer> getCategoryItemCountForClothes(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        List<Clothes> allClothes = clothesRepository.findByMember(member);
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

    public Map<String, Integer> getSeasonStatistics(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        List<Clothes> clothesList = clothesRepository.findByMember(member);
        Map<String, Integer> statistics = new HashMap<>();

        for (Clothes clothes : clothesList) {
            String[] seasons = clothes.getSeason().split(",");
            for (String season : seasons) {
                statistics.put(season, statistics.getOrDefault(season, 0) + 1);
            }
        }

        return statistics;
    }

    public List<Clothes> getTopItems(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return clothesRepository.findTop5ByMemberOrderByWearcntDesc(member);
    }


    public List<Clothes> getBottomItems(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return clothesRepository.findTop5ByMemberOrderByCreatedateAsc(member);
    }
    ///

    public List<Clothes> getFilteredClothes(String subcategory, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return clothesRepository.findBySubcategoryAndMember(subcategory, member);
    }

    public List<Clothes> getRecommendedClothes(String subcategory, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return clothesRepository.findTop2BySubcategoryAndMemberOrderByWearcntDesc(subcategory, member);
    }

    public List<Clothes> getRecommendedClothesAsc(String subcategory, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return clothesRepository.findTop2BySubcategoryAndMemberOrderByCreatedateAsc(subcategory, member);
    }

    public List<Clothes> getRandomRecommendedClothes(String subcategory, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return clothesRepository.getRandomRecommendedClothes(subcategory, member);
    }

    @Transactional
    public void updateWearCountAndCreateDate(Long imageId, Date date, Long memberId, int wearCountModifier) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        Optional<Clothes> optionalClothes = clothesRepository.findByIdAndMember(imageId, member);
        optionalClothes.ifPresent(clothes -> {
            int updatedWearCount = clothes.getWearcnt() + wearCountModifier;
            Date existingCreatedate = clothes.getCreatedate();

            if (existingCreatedate == null || date.after(existingCreatedate)) {
                clothes.setCreatedate(date);
            }

            clothes.setWearcnt(updatedWearCount);
            clothesRepository.save(clothes);
        });
    }

    public void updateWearCountAndCreateDateOnCreate(Long imageId, Date date, Long memberId) {
        updateWearCountAndCreateDate(imageId, date, memberId, 1);
    }

    public void updateWearCountAndCreateDateOnDelete(Long imageId, Date date, Long memberId) {
        updateWearCountAndCreateDate(imageId, date, memberId, -1);
    }

    public List<Clothes> getClothesByImageIds(List<Long> imageIds, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return clothesRepository.findByIdInAndMember(imageIds, member);
    }

    public boolean isImageUsedByOtherClothes(String imagePath, Long memberId, Long currentClothesId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        List<Clothes> clothesList = clothesRepository.findByImgpathAndMember(imagePath, member);

        // 현재 Clothes 제외하고 다른 Clothes에서 사용 중인지 확인
        return clothesList.stream()
                .anyMatch(clothes -> !clothes.getId().equals(currentClothesId));
    }
}