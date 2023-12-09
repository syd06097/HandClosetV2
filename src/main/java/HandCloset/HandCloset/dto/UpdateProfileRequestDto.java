package HandCloset.HandCloset.dto;

import lombok.Data;

@Data
public class UpdateProfileRequestDto {
    private Long memberId;
    private String editedUserName;
    private String editedGender;
}