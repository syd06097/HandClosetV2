package HandCloset.HandCloset.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;


//@Entity
//@Table(name="refresh_token")
//@NoArgsConstructor
//@Setter
//@Getter
//public class RefreshToken {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//    private Long memberId;
//    private String value;
//}
@Entity
@Table(name="refresh_token")
@NoArgsConstructor
@Setter
@Getter
public class RefreshToken implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long memberId;
    private String value;
}