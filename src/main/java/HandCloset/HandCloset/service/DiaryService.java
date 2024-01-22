package HandCloset.HandCloset.service;

import HandCloset.HandCloset.entity.Clothes;
import HandCloset.HandCloset.entity.Diary;
import HandCloset.HandCloset.entity.Member;
import HandCloset.HandCloset.repository.ClothesRepository;
import HandCloset.HandCloset.repository.DiaryRepository;

import HandCloset.HandCloset.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
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
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiaryService {

    @Value("C:/DiaryImageStorage")
    private String diaryUploadDirectory;

    private final DiaryRepository diaryRepository;
    private final ClothesService clothesService;

    private final MemberRepository memberRepository;

    @Transactional
    public Diary saveDiary(Diary diary) {
        return diaryRepository.save(diary);
    }

    @Transactional
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

    public List<Diary> getAllDiaryEntries(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return diaryRepository.findByMember(member);
    }

    public List<Diary> getDiaryEntriesByDate(Date date, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return diaryRepository.findAllByDateAndMember(date, member);
    }

    public Diary getDiaryEntryById(Long id, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return diaryRepository.findByIdAndMember(id, member).orElse(null);
    }

    public List<Long> getImageIdsByDiaryId(Long diaryId, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        Diary diary = diaryRepository.findByIdAndMember(diaryId, member).orElse(null);
        if (diary == null) {
            return Collections.emptyList();
        }
        return diary.getImageIds();
    }

    public List<Diary> findDiariesByImageId(Long imageId, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return diaryRepository.findAllByImageIdsContainingAndMember(imageId, member);
    }

    @Transactional
    public void deleteDiary(Long id, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        Diary diary = diaryRepository.findByIdAndMember(id, member).orElse(null);
        if (diary != null) {
            List<Long> imageIds = diary.getImageIds();

            if (!imageIds.isEmpty()) {
                for (Long imageId : imageIds) {
                    // Delegate the work to clothesService
                    Date secondLatestDate = findSecondLatestDateByImageId(imageId, memberId);
                    clothesService.updateWearCountAndCreateDateOnDelete(imageId, secondLatestDate, memberId);
                }
            }
            System.out.println("diaryRepository.deleteByIdAndMember(id, member);");
            diaryRepository.deleteByIdAndMember(id, member);
        }
    }

    @Transactional
    public void deleteDiaryAndImage(Long id, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        Diary diary = diaryRepository.findByIdAndMember(id, member).orElse(null);
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
                List<Diary> diariesUsingThumbnail = diaryRepository.findAllByThumbnailpathAndMember(diary.getThumbnailpath(), member);

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

            diaryRepository.deleteByIdAndMember(id, member);
        }
    }

    @Transactional
    public void deleteAllDiaries(Long memberId) {
        try {
            // Check if the thumbnail is used in other diaries
            Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
            List<Diary> diaryList = diaryRepository.findByMember(member);
            for (Diary diary : diaryList) {
                String thumbnailPath = diary.getThumbnailpath();
                String modifiedThumbnailPath = thumbnailPath.replace("\\", "/");
                Path thumbnailFilePath = Paths.get(modifiedThumbnailPath);
                Files.delete(thumbnailFilePath);
            }
            diaryRepository.deleteByMember(member);
        } catch (IOException e) {
            // Handle any IO exceptions if the image deletion fails
            e.printStackTrace();
            throw new RuntimeException("Failed to delete");
        }
    }

    public int getDiaryCount(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return diaryRepository.countByMember(member);
    }


    public List<Diary> findDiariesByThumbnailpath(String thumbnailpath, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        return diaryRepository.findAllByThumbnailpathAndMember(thumbnailpath, member);
    }


    public Date findSecondLatestDateByImageId(Long imageId, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        List<Diary> diaries = diaryRepository.findAllByImageIdsContainingAndMember(imageId, member);
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