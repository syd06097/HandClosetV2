package HandCloset.HandCloset.controller;

import HandCloset.HandCloset.entity.Clothes;
import HandCloset.HandCloset.service.ClothesService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clothing")
public class ClothesController {
    private final ClothesService clothesService;

    public ClothesController(ClothesService clothesService) {
        this.clothesService = clothesService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Clothes saveClothes(@RequestPart String imgurl,
                               @RequestPart String category,
                               @RequestPart String subcategory,
                               @RequestPart String season,
                               @RequestPart(required = false) String description) {
        Clothes clothes = new Clothes();
        clothes.setImgUrl(imgurl);
        clothes.setCategory(category);
        clothes.setSubcategory(subcategory);
        clothes.setSeason(season);
        clothes.setDescription(description);
        return clothesService.saveClothes(clothes);
    }

    @GetMapping("/{id}")
    public Clothes getClothes(@PathVariable Long id) {
        return clothesService.getClothes(id);
    }

    @GetMapping
    public List<Clothes> getAllClothes() {
        return clothesService.getAllClothes();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClothes(@PathVariable Long id) {
        clothesService.deleteClothes(id);
    }
}