package org.springframework.samples.petclinic.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Collection;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.owner.PricingPlan;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.samples.petclinic.vet.VetService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@DataJpaTest(includeFilters = @ComponentScan.Filter(Service.class))
class UserServiceTests {

	@Autowired
	private UserService userService;
	
	@Autowired
	private AuthoritiesService authService;
	
	@Autowired
	private VetService vetService;
	
	@Autowired
	private OwnerService ownerService;
	
	@Test
	@WithMockUser(username = "owner1", password = "0wn3r")
	void shouldFindCurrentUser() {
		User user = this.userService.findCurrentUser();
		assertEquals(user.getUsername(), "owner1");
	}
	
	@Test
	@WithMockUser(username = "prueba")
	void shouldNotFindCorrectCurrentUser() {
		assertThrows(ResourceNotFoundException.class, () -> this.userService.findCurrentUser());
	}
	
	@Test
	void shouldNotFindAuthenticated() {
		assertThrows(ResourceNotFoundException.class, () -> this.userService.findCurrentUser());
	}

	@Test
	void shouldFindAllUsers() {
		List<User> users = (List<User>) this.userService.findAll();
		assertThat(users.size()).isEqualTo(17);
	}

	@Test
	void shouldFindUserByUsername() {
		User user = this.userService.findUser("owner1");
		assertEquals(user.getUsername(), "owner1");

		assertThrows(ResourceNotFoundException.class, () -> this.userService.findUser("usernotexists"));
	}

	@Test
	void shouldFindSingleUser() {
		User user = this.userService.findUser(2);
		assertEquals(user.getUsername(), "owner1");
	}

	@Test
	void shouldNotFindSingleUserWithBadID() {
		assertThrows(ResourceNotFoundException.class, () -> this.userService.findUser(100));
	}
	
	@Test
	void shouldExistUser() {
		assertEquals(this.userService.existsUser("owner1"), true);
	}

	@Test
	void shouldNotExistUser() {
		assertEquals(this.userService.existsUser("owner10000"), false);
	}

	@Test
	@Transactional
	void shouldUpdateUser() {
		User user = this.userService.findUser(2);
		user.setUsername("Change");
		userService.updateUser(user, 2);
		user = this.userService.findUser(2);
		assertEquals(user.getUsername(), "Change");
	}

	@Test
	@Transactional
	void shouldInsertUser() {
		int count = ((Collection<User>) this.userService.findAll()).size();

		User user = new User();
		user.setUsername("Sam");
		user.setPassword("password");

		this.userService.saveUser(user);
		assertThat(user.getId().longValue()).isNotEqualTo(0);

		int finalCount = ((Collection<User>) this.userService.findAll()).size();
		assertThat(finalCount).isEqualTo(count + 1);
	}
	
	@Test
	@Transactional
	void shouldDeleteUserWithoutAuthorities(){
		Integer firstCount = ((Collection<User>) userService.findAll()).size();
		User user = new User();
		user.setUsername("Sam");
		user.setPassword("password");
		this.userService.saveUser(user);
		
		Integer secondCount = ((Collection<User>) userService.findAll()).size();
		assertEquals(secondCount, firstCount + 1);
		userService.deleteUser(user.getId());
		Integer lastCount = ((Collection<User>) userService.findAll()).size();
		assertEquals(firstCount, lastCount);
	}

	@Test
	@Transactional
	void shouldDeleteUserWithoutOwner(){
		Integer firstCount = ((Collection<User>) userService.findAll()).size();
		User user = new User();
		user.setUsername("Sam");
		user.setPassword("password");
		Authorities auth = authService.findByAuthority("OWNER");
		user.setAuthority(auth);
		this.userService.saveUser(user);
		
		Integer secondCount = ((Collection<User>) userService.findAll()).size();
		assertEquals(secondCount, firstCount + 1);
		userService.deleteUser(user.getId());
		Integer lastCount = ((Collection<User>) userService.findAll()).size();
		assertEquals(firstCount, lastCount);
	}
	
	@Test
	@Transactional
	void shouldDeleteUserWithOwner(){
		Integer firstCount = ((Collection<User>) userService.findAll()).size();
		User user = new User();
		user.setUsername("Sam");
		user.setPassword("password");
		Authorities auth = authService.findByAuthority("OWNER");
		user.setAuthority(auth);
		Owner owner = new Owner();
		owner.setAddress("Test");
		owner.setFirstName("Test");
		owner.setLastName("Test");
		owner.setPlan(PricingPlan.BASIC);
		owner.setTelephone("999999999");
		owner.setUser(user);
		owner.setCity("Test");
		this.ownerService.saveOwner(owner);
		
		Integer secondCount = ((Collection<User>) userService.findAll()).size();
		assertEquals(secondCount, firstCount + 1);
		userService.deleteUser(user.getId());
		Integer lastCount = ((Collection<User>) userService.findAll()).size();
		assertEquals(firstCount, lastCount);
	}
	
	@Test
	@Transactional
	void shouldDeleteUserWithoutVet(){
		Integer firstCount = ((Collection<User>) userService.findAll()).size();
		User user = new User();
		user.setUsername("Sam");
		user.setPassword("password");
		Authorities auth = authService.findByAuthority("VET");
		user.setAuthority(auth);
		this.userService.saveUser(user);
		
		Integer secondCount = ((Collection<User>) userService.findAll()).size();
		assertEquals(secondCount, firstCount + 1);
		userService.deleteUser(user.getId());
		Integer lastCount = ((Collection<User>) userService.findAll()).size();
		assertEquals(firstCount, lastCount);
	}
	
	@Test
	@Transactional
	void shouldDeleteUserWithVet(){
		Integer firstCount = ((Collection<User>) userService.findAll()).size();
		User user = new User();
		user.setUsername("Sam");
		user.setPassword("password");
		Authorities auth = authService.findByAuthority("VET");
		user.setAuthority(auth);
		Vet vet = new Vet();
		vet.setFirstName("Test");
		vet.setLastName("Test");
		vet.setUser(user);
		vet.setCity("Test");
		this.vetService.saveVet(vet);
		
		Integer secondCount = ((Collection<User>) userService.findAll()).size();
		assertEquals(secondCount, firstCount + 1);
		userService.deleteUser(user.getId());
		Integer lastCount = ((Collection<User>) userService.findAll()).size();
		assertEquals(firstCount, lastCount);
	}

}
