package org.springframework.samples.petclinic.auth;

import java.util.ArrayList;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.owner.PricingPlan;
import org.springframework.samples.petclinic.user.Authorities;
import org.springframework.samples.petclinic.user.AuthoritiesService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.samples.petclinic.vet.VetService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import petclinic.payload.request.SignupRequest;

@Service
public class AuthService {

	private final PasswordEncoder encoder;
	private final AuthoritiesService authoritiesService;
	private final UserService userService;
	private final OwnerService ownerService;
	private final VetService vetService;

	@Autowired
	public AuthService(PasswordEncoder encoder, AuthoritiesService authoritiesService, UserService userService,
			OwnerService ownerService, VetService vetService) {
		this.encoder = encoder;
		this.authoritiesService = authoritiesService;
		this.userService = userService;
		this.ownerService = ownerService;
		this.vetService = vetService;

	}

	@Transactional
	public void createUser(@Valid SignupRequest request) {
		User user = new User();
		user.setUsername(request.getUsername());
		user.setPassword(encoder.encode(request.getPassword()));
		String strRoles = request.getAuthority();
		Authorities role;

		switch (strRoles.toLowerCase()) {
		case "admin":
			role = authoritiesService.findByAuthority("ADMIN");
			user.setAuthority(role);
			userService.saveUser(user);
			break;
		case "vet":
			role = authoritiesService.findByAuthority("VET");
			user.setAuthority(role);
			userService.saveUser(user);
			Vet vet = new Vet();
			vet.setFirstName(request.getFirstName());
			vet.setLastName(request.getLastName());
			vet.setCity(request.getCity());
			vet.setSpecialties(new ArrayList<>());
			vet.setUser(user);
			vetService.saveVet(vet);
			break;
		default:
			role = authoritiesService.findByAuthority("OWNER");
			user.setAuthority(role);
			userService.saveUser(user);
			Owner owner = new Owner();
			owner.setFirstName(request.getFirstName());
			owner.setLastName(request.getLastName());
			owner.setAddress(request.getAddress());
			owner.setCity(request.getCity());
			owner.setTelephone(request.getTelephone());
			owner.setPlan(PricingPlan.BASIC);
			owner.setUser(user);
			ownerService.saveOwner(owner);

		}
	}

}
