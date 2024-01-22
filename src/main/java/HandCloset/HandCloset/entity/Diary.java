package HandCloset.HandCloset.entity;


import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "diary")
public class Diary {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date date;

    @Column(nullable = false)
    private String season;

    private String thumbnailpath;
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private String note;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime regdate;

    @ElementCollection
    @CollectionTable(name = "diary_image_ids", joinColumns = @JoinColumn(name = "diary_id"))
    @Column(name = "image_id")
    private List<Long> imageIds;


}
