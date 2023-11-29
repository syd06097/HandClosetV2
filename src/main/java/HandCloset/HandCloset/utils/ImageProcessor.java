
//package HandCloset.HandCloset.utils;
//
//
//import org.opencv.core.*;
//import org.opencv.imgcodecs.Imgcodecs;
//import org.opencv.imgproc.Imgproc;
//import org.springframework.web.multipart.MultipartFile;
//import java.io.IOException;
//
//public class ImageProcessor {
//
//    static {
//        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
//        System.out.println("OpenCV loaded: " + Core.NATIVE_LIBRARY_NAME);
//    }
//
//    public static MultipartFile resizeAndRemoveBackground(MultipartFile file) {
//        try {
//            // MultipartFile을 Mat 형태로 변환
//            Mat image = Imgcodecs.imdecode(new MatOfByte(file.getBytes()), Imgcodecs.IMREAD_UNCHANGED);
//
//            // 200x200 사이즈로 리사이징
//            Size newSize = new Size(200, 200);
//            Imgproc.resize(image, image, newSize);
//
//            // 초기 마스크 생성
//            Mat mask = new Mat(image.rows(), image.cols(), CvType.CV_8U, Scalar.all(0));
//
//            // 사각형 좌표: 시작점의 x,y, 너비, 높이 (이 부분은 원하는 영역을 선택하는 부분입니다.)
//            Rect rectangle = new Rect(0, 0, 190, 190);
//
//            // grabCut 실행
//            Mat bgdModel = new Mat();
//            Mat fgdModel = new Mat();
//            Imgproc.grabCut(image, mask, rectangle, bgdModel, fgdModel, 5, Imgproc.GC_INIT_WITH_RECT);
//
//            // 배경인 곳은 0, 그 외에는 1로 설정한 마스크 생성
//            Core.compare(mask, new Scalar(2), mask, Core.CMP_EQ);
//
//            // 결과 이미지 생성
//            Mat result = new Mat();
//            image.copyTo(result, mask);
//
//            // 결과 이미지를 MultipartFile 형태로 변환
//            byte[] byteArray = new byte[(int) result.total() * result.channels()];
//            result.get(0, 0, byteArray);
//            return new ByteArrayMultipartFile(file.getName(), file.getOriginalFilename(), file.getContentType(), byteArray);
//        } catch (IOException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }
//}
package HandCloset.HandCloset.utils;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;
public class ImageProcessor {

    public static MultipartFile resizeImage(MultipartFile file, int targetWidth, int targetHeight) {
        try {
            // MultipartFile을 BufferedImage로 변환
            BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(file.getBytes()));

            // 새로운 크기로 이미지 생성
            BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = resizedImage.createGraphics();

            // 이미지 그리기
            g.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
            g.dispose();

            // BufferedImage를 바이트 배열로 변환
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(resizedImage, "jpg", baos);
            baos.flush();
            byte[] imageInByte = baos.toByteArray();
            baos.close();

            // 바이트 배열을 MultipartFile로 변환
            return new ByteArrayMultipartFile(file.getName(), file.getOriginalFilename(), file.getContentType(), imageInByte);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}


