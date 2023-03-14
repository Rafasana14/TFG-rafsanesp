package org.springframework.samples.petclinic.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Collection;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.samples.petclinic.vet.VetService;

import petclinic.payload.request.SignupRequest;

@SpringBootTest
//@DataJpaTest(includeFilters = @ComponentScan.Filter({Service.class}))
public class AuthServiceTests {

	@Autowired
	protected AuthService authService;
	@Autowired
	protected UserService userService;
	@Autowired
	protected VetService vetService;
	@Autowired
	protected OwnerService ownerService;

	@Test
	public void shouldCreateAdminUser() {
		SignupRequest request = createRequest("ADMIN", "admin2");
		int userFirstCount = ((Collection<User>) this.userService.findAll()).size();
		this.authService.createUser(request);
		int userLastCount = ((Collection<User>) this.userService.findAll()).size();
		assertEquals(userFirstCount + 1, userLastCount);
	}
	
	@Test
	public void shouldCreateVetUser() {
		SignupRequest request = createRequest("VET", "vettest");
		int userFirstCount = ((Collection<User>) this.userService.findAll()).size();
		int vetFirstCount = ((Collection<Vet>) this.vetService.findAll()).size();
		this.authService.createUser(request);
		int userLastCount = ((Collection<User>) this.userService.findAll()).size();
		int vetLastCount = ((Collection<Vet>) this.vetService.findAll()).size();
		assertEquals(userFirstCount + 1, userLastCount);
		assertEquals(vetFirstCount + 1, vetLastCount);
	}
	
	@Test
	public void shouldCreateOwnerUser() {
		SignupRequest request = createRequest("OWNER", "ownertest");
		int userFirstCount = ((Collection<User>) this.userService.findAll()).size();
		int ownerFirstCount = ((Collection<Owner>) this.ownerService.findAll()).size();
		this.authService.createUser(request);
		int userLastCount = ((Collection<User>) this.userService.findAll()).size();
		int ownerLastCount = ((Collection<Owner>) this.ownerService.findAll()).size();
		assertEquals(userFirstCount + 1, userLastCount);
		assertEquals(ownerFirstCount + 1, ownerLastCount);
	}

	private SignupRequest createRequest(String auth, String username) {
		SignupRequest request = new SignupRequest();
		request.setAddress("prueba");
		request.setAuthority(auth);
		request.setCity("prueba");
		request.setFirstName("prueba");
		request.setLastName("prueba");
		request.setPassword("prueba");
		request.setTelephone("123123123");
		request.setUsername(username);
		return request;
	}

}
