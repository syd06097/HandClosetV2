package HandCloset.HandCloset.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;


@Entity
@Table(name = "clothes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Clothes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imgpath;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String subcategory;

    @Column(nullable = false)
    private String season;

    @Column(nullable = false)
    private String color;

    private String description;

    private int wearcnt;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private Date createdate;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime regdate;


}