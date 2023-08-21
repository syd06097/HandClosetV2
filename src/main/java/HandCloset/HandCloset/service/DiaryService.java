package HandCloset.HandCloset.service;

import HandCloset.HandCloset.entity.Diary;
import HandCloset.HandCloset.repository.DiaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class DiaryService {

    private final DiaryRepository diaryRepository;


    public DiaryService(DiaryRepository diaryRepository) {
        this.diaryRepository = diaryRepository;
    }

    public Diary saveDiary(Diary diary) {
        return diaryRepository.save(diary);
    }
}