public class SystemPropertyExample {
    public static void main(String[] args) {
        String libraryPath = System.getProperty("java.library.path");
        System.out.println(libraryPath);
    }
}
