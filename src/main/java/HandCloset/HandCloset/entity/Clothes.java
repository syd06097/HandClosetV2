package HandCloset.HandCloset.entity;

import javax.persistence.*;

@Entity
@Table(name = "clothes")
public class Clothes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imgurl;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String subcategory;

    @Column(nullable = false)
    private String season;

    @Column(nullable = false)
    private String description;

    // 생성자, 게터, 세터 생략
}
