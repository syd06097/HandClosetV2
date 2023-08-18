package HandCloset.HandCloset.controller;


import HandCloset.HandCloset.entity.Diary;
import HandCloset.HandCloset.service.ClothesService;
import HandCloset.HandCloset.service.DiaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/api/diary")
public class DiaryController {

    private final DiaryService diaryService;
    public DiaryController(DiaryService diaryService) {
        this.diaryService = diaryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Diary saveDiary(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date,
                           @RequestParam("season") String season) {
        Diary diary = new Diary();
        diary.setDate(date);
        diary.setSeason(season);
        return diaryService.saveDiary(diary);
    }
}