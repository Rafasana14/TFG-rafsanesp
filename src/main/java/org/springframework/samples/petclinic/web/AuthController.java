package org.springframework.samples.petclinic.web;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.configuration.jwt.JwtUtils;
import org.springframework.samples.petclinic.configuration.services.UserDetailsImpl;
import org.springframework.samples.petclinic.user.Authorities;
import org.springframework.samples.petclinic.user.AuthoritiesService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
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
import petclinic.payload.response.JwtResponse;
import petclinic.payload.response.MessageResponse;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	AuthenticationManager authenticationManager;

	private final UserService userService;

	private final AuthoritiesService authoritiesService;

	private final PasswordEncoder encoder;

	private final JwtUtils jwtUtils;

	@Autowired
	public AuthController(AuthenticationManager authenticationManager, UserService userService,
			AuthoritiesService authoritiesService, PasswordEncoder encoder, JwtUtils jwtUtils) {
		this.authenticationManager = authenticationManager;
		this.userService = userService;
		this.authoritiesService = authoritiesService;
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

		return ResponseEntity.ok().body(new JwtResponse(jwt, userDetails.getUsername(), roles));
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (userService.existsUser(signUpRequest.getUsername())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
		}

		// Create new user's account
		User user = new User();
		user.setUsername(signUpRequest.getUsername());
		user.setPassword(encoder.encode(signUpRequest.getPassword()));
		String strRoles = signUpRequest.getRole();
		Authorities role;
		if (strRoles == null) {
			role = authoritiesService.findByAuthority("OWNER");
		} else {
			switch (strRoles.toLowerCase()) {
			case "admin" :
				role = authoritiesService.findByAuthority("ADMIN");
				break;
			case "veterinarian":
				role = authoritiesService.findByAuthority("VETERINARIAN");
				break;
			default:
				role = authoritiesService.findByAuthority("OWNER");
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
		user.setAuthority(role);
		userService.saveUser(user);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}

}
