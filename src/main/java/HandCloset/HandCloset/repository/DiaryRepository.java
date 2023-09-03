package HandCloset.HandCloset.repository;

import HandCloset.HandCloset.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findAllByDate(Date date);
    List<Diary> findAllByImageIdsContaining(Long imageId);
}