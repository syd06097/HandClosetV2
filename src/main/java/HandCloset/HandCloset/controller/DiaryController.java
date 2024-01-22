package HandCloset.HandCloset.controller;

import HandCloset.HandCloset.entity.Diary;
import HandCloset.HandCloset.security.jwt.util.IfLogin;
import HandCloset.HandCloset.security.jwt.util.LoginUserDto;
import HandCloset.HandCloset.security.jwt.util.UnauthorizedException;
import HandCloset.HandCloset.service.ClothesService;
import HandCloset.HandCloset.service.DiaryService;
import HandCloset.HandCloset.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/diary")
@Transactional
public class DiaryController {


    private final DiaryService diaryService;
    private final ClothesService clothesService;
    private final MemberService memberService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Diary> saveDiary(@RequestParam("file") MultipartFile file,
                                           @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date,
                                           @RequestParam("season") String season,
                                           @RequestParam("imageIds") String imageIds,
                                           @RequestParam(value = "note", required = false) String note,
                                           @IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Long> imageIdList = Arrays.stream(imageIds.split(","))
                    .map(Long::parseLong)
                    .collect(Collectors.toList());

            Diary diary = new Diary();
            String thumbnailPath = diaryService.saveThumbnail(file, loginUserDto.getMemberId());
            diary.setThumbnailpath(thumbnailPath);
            diary.setDate(date);
            diary.setSeason(season);
            diary.setNote(note);
            diary.setImageIds(imageIdList);
            diary.setMember(memberService.findMemberById(loginUserDto.getMemberId()));
            Diary savedDiary = diaryService.saveDiary(diary);

            for (Long imageId : imageIdList) {
                clothesService.updateWearCountAndCreateDateOnCreate(imageId, date, loginUserDto.getMemberId());
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(savedDiary);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @Transactional
    public ResponseEntity<String> deleteDiaryEntry(@IfLogin LoginUserDto loginUserDto, @PathVariable Long id) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            try {
                Diary diary = diaryService.getDiaryEntryById(id, loginUserDto.getMemberId());

                List<Diary> diariesUsingThumbnail = diaryService.findDiariesByThumbnailpath(diary.getThumbnailpath(), loginUserDto.getMemberId());

                if (diariesUsingThumbnail.size() == 1 && diariesUsingThumbnail.get(0).getId().equals(id)) {

                    String thumbnailPath = diary.getThumbnailpath();
                    String modifiedThumbnailPath = thumbnailPath.replace("\\", "/");
                    Path thumbnailFilePath = Paths.get(modifiedThumbnailPath);
                    Files.delete(thumbnailFilePath);
                    System.out.println("Files.delete(thumbnailFilePath);");
                }

                diaryService.deleteDiary(id, loginUserDto.getMemberId());
                System.out.println("diaryService.deleteDiary(id, loginUserDto.getMemberId());");

                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Diary entry deleted successfully.");
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete image and data.");
            }
        }
    }


    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Integer> getTotalDiariesCount(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            int DiaryTotalCount = diaryService.getDiaryCount(loginUserDto.getMemberId());
            return ResponseEntity.ok(DiaryTotalCount);
        }
    }

    @GetMapping("/entries")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Diary>> getAllDiaryEntries(@IfLogin LoginUserDto loginUserDto) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Diary> diaryEntries = diaryService.getAllDiaryEntries(loginUserDto.getMemberId());
            return new ResponseEntity<>(diaryEntries, HttpStatus.OK);
        }
    }

    @GetMapping("/entry")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Diary>> getDiaryEntries(@IfLogin LoginUserDto loginUserDto, @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Diary> diaryEntries = diaryService.getDiaryEntriesByDate(date, loginUserDto.getMemberId());
            return new ResponseEntity<>(diaryEntries, HttpStatus.OK);
        }
    }

    @GetMapping("/entryData/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Diary> getDiaryEntry(@IfLogin LoginUserDto loginUserDto, @PathVariable Long id) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            Diary diary = diaryService.getDiaryEntryById(id, loginUserDto.getMemberId());
            if (diary == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(diary);
        }
    }

    @GetMapping(value = "/images")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<byte[]> getDiaryImage(@IfLogin LoginUserDto loginUserDto, @RequestParam String thumbnailpath) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
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

    @GetMapping("/entryData/{id}/imageIds")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Long>> getImageIdsByDiaryId(@IfLogin LoginUserDto loginUserDto, @PathVariable Long id) {
        if (loginUserDto == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        } else {
            List<Long> imageIds = diaryService.getImageIdsByDiaryId(id, loginUserDto.getMemberId());
            return ResponseEntity.ok(imageIds);
        }
    }


}