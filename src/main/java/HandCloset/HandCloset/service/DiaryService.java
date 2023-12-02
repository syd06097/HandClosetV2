package HandCloset.HandCloset.service;

import HandCloset.HandCloset.entity.Clothes;
import HandCloset.HandCloset.entity.Diary;
import HandCloset.HandCloset.repository.ClothesRepository;
import HandCloset.HandCloset.repository.DiaryRepository;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
public class DiaryService {

    @Value("C:/DiaryImageStorage")
    private String diaryUploadDirectory;

    private final DiaryRepository diaryRepository;
    private final ClothesService clothesService;

    public DiaryService(DiaryRepository diaryRepository, ClothesService clothesService) {
        this.diaryRepository = diaryRepository;
        this.clothesService=clothesService;


    }

    public Diary saveDiary(Diary diary) {
        return diaryRepository.save(diary);
    }


    public String saveThumbnail(MultipartFile file, Long memberId) {
        try {
            // 사용자별 디렉토리 생성
            String userDirectory = diaryUploadDirectory + File.separator + "member_" + memberId;
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
    public List<Diary> getAllDiaryEntries(Long memberId) {
        return diaryRepository.findByMemberId(memberId);
    }
    @Transactional(readOnly = true)
    public List<Diary> getDiaryEntriesByDate(Date date,Long memberId) {
        return diaryRepository.findAllByDateAndMemberId(date,memberId);
    }
    @Transactional(readOnly = true)
    public Diary getDiaryEntryById(Long id,Long memberId) {
        return diaryRepository.findByIdAndMemberId(id, memberId).orElse(null);
    }
    @Transactional(readOnly = true)
    public List<Long> getImageIdsByDiaryId(Long diaryId,Long memberId) {
        Diary diary = diaryRepository.findByIdAndMemberId(diaryId, memberId).orElse(null);
        if (diary == null) {
            return Collections.emptyList();
        }
        return diary.getImageIds();
    }
    @Transactional(readOnly = true)
    public List<Diary> findDiariesByImageId(Long imageId,Long memberId) {
        return diaryRepository.findAllByImageIdsContainingAndMemberId(imageId,memberId);
    }

    public void deleteDiary(Long id,Long memberId) {
        Diary diary = diaryRepository.findByIdAndMemberId(id,memberId).orElse(null);
        if (diary != null) {
            List<Long> imageIds = diary.getImageIds();

            if (!imageIds.isEmpty()) {
                for (Long imageId : imageIds) {
                    // Delegate the work to clothesService
                    Date secondLatestDate = findSecondLatestDateByImageId(imageId,memberId);
                    clothesService.updateWearCountAndCreateDateOnDelete(imageId, secondLatestDate,memberId);
                }
            }

            diaryRepository.deleteByIdAndMemberId(id,memberId);
        }
    }
    //다른 클래스에서 활용하는 메서드
    public void deleteDiaryAndImage(Long id, Long memberId) {
        Diary diary = diaryRepository.findByIdAndMemberId(id, memberId).orElse(null);
        if (diary != null) {
            List<Long> imageIds = diary.getImageIds();

            if (!imageIds.isEmpty()) {
                for (Long imageId : imageIds) {
                    // Delegate the work to clothesService
                    Date secondLatestDate = findSecondLatestDateByImageId(imageId, memberId);
                    clothesService.updateWearCountAndCreateDateOnDelete(imageId, secondLatestDate, memberId);
                }
            }

            // 이 부분에서 이미지 파일 삭제 로직 추가
            try {
                // Check if the thumbnail is used in other diaries
                List<Diary> diariesUsingThumbnail = diaryRepository.findAllByThumbnailpathAndMemberId(diary.getThumbnailpath(), memberId);

                if (diariesUsingThumbnail.size() == 1 && diariesUsingThumbnail.get(0).getId().equals(id)) {
                    // If the thumbnail is only used in the current diary, delete the thumbnail
                    String thumbnailPath = diary.getThumbnailpath();
                    String modifiedThumbnailPath = thumbnailPath.replace("\\", "/");
                    Path thumbnailFilePath = Paths.get(modifiedThumbnailPath);
                    Files.delete(thumbnailFilePath);
                }
            } catch (IOException e) {
                // Handle any IO exceptions if the image deletion fails
                e.printStackTrace();
                throw new RuntimeException("Failed to delete image and data.");
            }

            diaryRepository.deleteByIdAndMemberId(id, memberId);
        }
    }

    public void deleteAllDiaries(Long memberId){
        try {
            // Check if the thumbnail is used in other diaries
            List<Diary> diaryList = diaryRepository.findByMemberId(memberId);
            for (Diary diary : diaryList){
                String thumbnailPath = diary.getThumbnailpath();
                String modifiedThumbnailPath = thumbnailPath.replace("\\", "/");
                Path thumbnailFilePath = Paths.get(modifiedThumbnailPath);
                Files.delete(thumbnailFilePath);
            }
            diaryRepository.deleteByMemberId(memberId);
        } catch (IOException e) {
            // Handle any IO exceptions if the image deletion fails
            e.printStackTrace();
            throw new RuntimeException("Failed to delete");
        }
    }

    @Transactional(readOnly = true)
    public List<Diary> findDiariesByThumbnailpath(String thumbnailpath, Long memberId) {
        return diaryRepository.findAllByThumbnailpathAndMemberId(thumbnailpath, memberId);
    }


    public Date findSecondLatestDateByImageId(Long imageId,Long memberId) {
        List<Diary> diaries = diaryRepository.findAllByImageIdsContainingAndMemberId(imageId,memberId);
        Date latestDate = null;
        Date secondLatestDate = null;

        for (Diary diary : diaries) {
            List<Long> imageIds = diary.getImageIds();
            if (imageIds.contains(imageId)) {
                Date diaryDate = diary.getDate();
                if (latestDate == null || diaryDate.after(latestDate)) {
                    secondLatestDate = latestDate;
                    latestDate = diaryDate;
                } else if (secondLatestDate == null || diaryDate.after(secondLatestDate)) {
                    secondLatestDate = diaryDate;
                }
            }
        }

        return secondLatestDate;
    }


}