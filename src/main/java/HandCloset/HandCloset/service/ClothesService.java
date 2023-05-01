package HandCloset.HandCloset.service;

import HandCloset.HandCloset.entity.Clothes;
import HandCloset.HandCloset.repository.ClothesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ClothesService {

    private final ClothesRepository clothesRepository;

    public ClothesService(ClothesRepository clothesRepository) {
        this.clothesRepository = clothesRepository;
    }

    @Transactional
    public Clothes saveClothes(Clothes clothes) {
        return clothesRepository.save(clothes);
    }

    public Clothes getClothes(Long id) {
        return clothesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Clothes not found"));
    }

    public List<Clothes> getAllClothes() {
        return clothesRepository.findAll();
    }

    @Transactional
    public void deleteClothes(Long id) {
        clothesRepository.deleteById(id);
    }
}