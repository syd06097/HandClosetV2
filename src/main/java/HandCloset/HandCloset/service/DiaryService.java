package HandCloset.HandCloset.service;

import HandCloset.HandCloset.entity.Diary;
import HandCloset.HandCloset.repository.DiaryRepository;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;


@Service
public class DiaryService {

    @Value("C:/DiaryImageStorage")
    private String diaryUploadDirectory;

    private final DiaryRepository diaryRepository;


    public DiaryService(DiaryRepository diaryRepository) {
        this.diaryRepository = diaryRepository;
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
}