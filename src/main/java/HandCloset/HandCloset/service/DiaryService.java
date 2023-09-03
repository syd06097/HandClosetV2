package HandCloset.HandCloset.service;

import HandCloset.HandCloset.entity.Clothes;
import HandCloset.HandCloset.entity.Diary;
import HandCloset.HandCloset.repository.ClothesRepository;
import HandCloset.HandCloset.repository.DiaryRepository;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
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


    public String saveThumbnail(MultipartFile file) {
        try {
            // 이미지를 파일 시스템에 저장하고 저장된 경로를 반환합니다.
            String filePath = diaryUploadDirectory + File.separator + file.getOriginalFilename();
            file.transferTo(new File(filePath));
            return filePath;
        } catch (IOException e) {
            // 예외 처리
            e.printStackTrace();
            return null;
        }
    }

    public List<Diary> getAllDiaryEntries() {
        return diaryRepository.findAll();
    }

    public List<Diary> getDiaryEntriesByDate(Date date) {
        return diaryRepository.findAllByDate(date);
    }

    public Diary getDiaryEntryById(Long id) {
        return diaryRepository.findById(id).orElse(null);
    }
    public List<Long> getImageIdsByDiaryId(Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId).orElse(null);
        if (diary == null) {
            return Collections.emptyList();
        }
        return diary.getImageIds();
    }
    public List<Diary> findDiariesByImageId(Long imageId) {
        return diaryRepository.findAllByImageIdsContaining(imageId);
    }

    public void deleteDiary(Long id) {
        Diary diary = diaryRepository.findById(id).orElse(null);
        if (diary != null) {
            List<Long> imageIds = diary.getImageIds();

            if (!imageIds.isEmpty()) {
                for (Long imageId : imageIds) {
                    // Delegate the work to clothesService
                    Date secondLatestDate = findSecondLatestDateByImageId(imageId);
                    clothesService.updateWearCountAndCreateDateOnDelete(imageId, secondLatestDate);
                }
            }

            diaryRepository.deleteById(id);
        }
    }




    public Date findSecondLatestDateByImageId(Long imageId) {
        List<Diary> diaries = diaryRepository.findAllByImageIdsContaining(imageId);
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