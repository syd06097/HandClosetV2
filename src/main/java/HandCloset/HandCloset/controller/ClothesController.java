
package HandCloset.HandCloset.controller;

import HandCloset.HandCloset.entity.Clothes;
import HandCloset.HandCloset.service.ClothesService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import java.io.File;


@RestController
@RequestMapping("/api/clothing")
public class ClothesController {
    private final ClothesService clothesService;

    @Value("${upload.directory}")
    private String uploadDirectory;

    public ClothesController(ClothesService clothesService) {
        this.clothesService = clothesService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Clothes saveClothes(@RequestParam("file") MultipartFile file,
                               @RequestParam("category") String category,
                               @RequestParam("subcategory") String subcategory,
                               @RequestParam("season") String season,
                               @RequestParam(value = "description", required = false) String description) {
        Clothes clothes = new Clothes();
        // 파일을 저장하고 저장된 경로를 DB에 저장합니다.
        String imagePath = clothesService.saveImage(file);
        clothes.setImgPath(imagePath);
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

    @GetMapping("/category")
    public List<Clothes> getClothesByCategoryAndSubcategory(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory) {

        if ("전체".equals(category)) {
            return clothesService.getAllClothes();
        } else {
            return clothesService.getClothesByCategoryAndSubcategory(category, subcategory);
        }
    }

    @GetMapping(value = "/images/{id}", produces = MediaType.IMAGE_JPEG_VALUE) //이미지의 경로를 통해 단일 이미지를 가져옴
    public byte[] getClothesImage(@PathVariable Long id) throws IOException {
        Clothes clothes = clothesService.getClothes(id);
        String imgPath = clothes.getImgPath();
        Path imagePath = Paths.get(imgPath);
        return Files.readAllBytes(imagePath);
    }

    @GetMapping("/images/all")
    public List<byte[]> getAllClothesImagePaths() throws IOException {
        List<byte[]> allImages = new ArrayList<>();

        // 데이터베이스에서 이미지 파일 경로를 가져옴
        List<Clothes> clothesList = clothesService.getAllClothes();
        for (Clothes clothes : clothesList) {
            String imagePath = clothes.getImgPath();
            Path imageFilePath = Paths.get(imagePath);
            byte[] imageBytes = Files.readAllBytes(imageFilePath);
            allImages.add(imageBytes);
        }

        return allImages;
    }

}