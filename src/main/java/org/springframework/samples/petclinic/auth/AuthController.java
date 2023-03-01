package org.springframework.samples.petclinic.auth;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.configuration.jwt.JwtUtils;
import org.springframework.samples.petclinic.configuration.services.UserDetailsImpl;
import org.springframework.samples.petclinic.exceptions.TokenRefreshException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.user.Authorities;
import org.springframework.samples.petclinic.user.AuthoritiesService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.samples.petclinic.vet.VetService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import petclinic.payload.request.LoginRequest;
import petclinic.payload.request.SignupRequest;
import petclinic.payload.request.TokenRefreshRequest;
import petclinic.payload.response.JwtResponse;
import petclinic.payload.response.MessageResponse;
import petclinic.payload.response.TokenRefreshResponse;




@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	AuthenticationManager authenticationManager;

	private final UserService userService;
	private final OwnerService ownerService;
	private final VetService vetService;
	private final AuthoritiesService authoritiesService;
	private final RefreshTokenService refreshTokenService;

	private final PasswordEncoder encoder;

	private final JwtUtils jwtUtils;

	@Autowired
	public AuthController(UserService userService, AuthoritiesService authoritiesService, PasswordEncoder encoder,
			JwtUtils jwtUtils, OwnerService ownerService, VetService vetService,
			RefreshTokenService refreshTokenService) {
		this.userService = userService;
		this.authoritiesService = authoritiesService;
		this.ownerService = ownerService;
		this.vetService = vetService;
		this.refreshTokenService = refreshTokenService;
		this.encoder = encoder;
		this.jwtUtils = jwtUtils;
	}

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);

		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
				.collect(Collectors.toList());

		RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

		return ResponseEntity.ok().body(
				new JwtResponse(jwt, refreshToken.getToken(), userDetails.getId(), userDetails.getUsername(), roles));
	}

	@PostMapping("/refreshtoken")
	public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
		String requestRefreshToken = request.getRefreshToken();

		return refreshTokenService.findByToken(requestRefreshToken).map(refreshTokenService::verifyExpiration)
				.map(RefreshToken::getUser).map(user -> {
					String token = jwtUtils.generateTokenFromUsername(user.getUsername());
					return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
				})
				.orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!"));
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (userService.existsUser(signUpRequest.getUsername())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
		}

		createUser(signUpRequest);
		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}

	private void createUser(@Valid SignupRequest request) {
		User user = new User();
		user.setUsername(request.getUsername());
		user.setPassword(encoder.encode(request.getPassword()));
		String strRoles = request.getAuthority();
		Authorities role;
		if (strRoles == null) {
			role = authoritiesService.findByAuthority("OWNER");
		} else {
			switch (strRoles.toLowerCase()) {
			case "admin":
				role = authoritiesService.findByAuthority("ADMIN");
				break;
			case "vet":
				role = authoritiesService.findByAuthority("VET");
				user.setAuthority(role);
				userService.saveUser(user);
				Vet vet = new Vet();
				vet.setFirstName(request.getFirstName());
				vet.setLastName(request.getLastName());
				vet.setCity(request.getCity());
				vet.setSpecialties(request.getSpecialties());
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
				owner.setPlan(request.getPlan());
				owner.setUser(user);
				ownerService.saveOwner(owner);
			}
		}

		// SI EN ALGÚN MOMENTO QUIERO MULTIPLES ROLES
//		Set<String> strRoles = signUpRequest.getRole();
//		Set<Authorities> roles = new HashSet<>();
//		
//		if (strRoles == null) {
//			Authorities userRole = authoritiesService.findByAuthority(Role.USER);
//			roles.add(userRole);
//		} else {
//			strRoles.forEach(role -> {
//				switch (role) {
//				case "admin":
//					Authorities adminRole = authoritiesService.findByAuthority(Role.ADMIN);
//					roles.add(adminRole);
//
//					break;
//				case "mod":
//					Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
//							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//					roles.add(modRole);
//
//					break;
//				default:
//					Authorities userRole = authoritiesService.findByAuthority(Role.USER);
//					roles.add(userRole);
//				}
//			});
//		}

		// user.setRoles(roles);
	}

}
