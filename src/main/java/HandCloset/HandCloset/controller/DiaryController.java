package HandCloset.HandCloset.controller;


import HandCloset.HandCloset.entity.Clothes;
import HandCloset.HandCloset.entity.Diary;
import HandCloset.HandCloset.service.ClothesService;
import HandCloset.HandCloset.service.DiaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/diary")
public class DiaryController {

    @Value("C:/DiaryImageStorage")
    private String diaryUploadDirectory;

    private final DiaryService diaryService;
    private final ClothesService clothesService;
    public DiaryController(DiaryService diaryService,ClothesService clothesService) {
        this.diaryService = diaryService;
        this.clothesService = clothesService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Diary saveDiary(@RequestParam("file") MultipartFile file,
                           @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date,
                           @RequestParam("season") String season,
                           @RequestParam("imageIds") String imageIds,
                           @RequestParam(value = "note", required = false) String note) {

        List<Long> imageIdList = Arrays.stream(imageIds.split(","))
                .map(Long::parseLong)
                .collect(Collectors.toList());

        System.out.println("imageIdList: " + imageIdList);



        Diary diary = new Diary();
        String thumbnailPath = diaryService.saveThumbnail(file);
        diary.setThumbnailpath(thumbnailPath);
        diary.setDate(date);
        diary.setSeason(season);
        diary.setNote(note);
        diary.setImageIds(imageIdList); // Set image IDs

        Diary savedDiary = diaryService.saveDiary(diary);

        // Update wearcnt and createdate for each selected image
        for (Long imageId : imageIdList) {
            clothesService.updateWearCountAndCreateDate(imageId,date);
        }

        return savedDiary;
    }

    @GetMapping("/entries")
    public ResponseEntity<List<Diary>> getAllDiaryEntries() {
        List<Diary> diaryEntries = diaryService.getAllDiaryEntries();
        return new ResponseEntity<>(diaryEntries, HttpStatus.OK);
    }
    @GetMapping("/entry")
    public ResponseEntity<List<Diary>> getDiaryEntries(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date) {
        List<Diary> diaryEntries = diaryService.getDiaryEntriesByDate(date);
        return new ResponseEntity<>(diaryEntries, HttpStatus.OK);
    }
//    @GetMapping(value = "/images", produces = MediaType.IMAGE_JPEG_VALUE)
//    public ResponseEntity<byte[]> getDiaryImage(@RequestParam String thumbnailpath) {
//        try {
//            Path imagePath = Paths.get(thumbnailpath);
//            byte[] imageBytes = Files.readAllBytes(imagePath);
//            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
//        } catch (IOException e) {
//            e.printStackTrace();
//            return ResponseEntity.notFound().build();
//        }
//    }
@GetMapping(value = "/images")
public ResponseEntity<byte[]> getDiaryImage(@RequestParam String thumbnailpath) {
    try {
        Path imagePath = Paths.get(thumbnailpath);
        byte[] imageBytes = Files.readAllBytes(imagePath);
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
    } catch (IOException e) {
        e.printStackTrace();
        return ResponseEntity.notFound().build();
    }
}
}