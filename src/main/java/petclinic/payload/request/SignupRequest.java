package petclinic.payload.request;

import java.util.List;

import javax.validation.constraints.NotBlank;

import org.springframework.samples.petclinic.owner.PricingPlan;
import org.springframework.samples.petclinic.vet.Specialty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
	
	// User
	@NotBlank
	private String username;

	private String authority;

	@NotBlank
	private String password;
	
	//Both
	@NotBlank
	private String firstName;
	
	@NotBlank
	private String lastName;
	
	//Owner
	private String address;
	private String city;
	private String telephone;
	private PricingPlan plan;
	
	//Vet
	private List<Specialty> specialties;
	

}
