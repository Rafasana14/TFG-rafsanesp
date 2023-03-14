package petclinic.payload.request;

import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenRefreshRequest {
	
	 @NotBlank
	  private String refreshToken;

	  public String getRefreshToken() {
	    return refreshToken;
	  }

	  public void setRefreshToken(String refreshToken) {
	    this.refreshToken = refreshToken;
	  }

}
