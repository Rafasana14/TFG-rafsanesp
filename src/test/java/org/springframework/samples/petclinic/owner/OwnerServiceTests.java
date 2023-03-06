/*
 * Copyright 2002-2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springframework.samples.petclinic.owner;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.pet.Pet;
import org.springframework.samples.petclinic.pet.PetService;
import org.springframework.samples.petclinic.pet.exceptions.DuplicatedPetNameException;
import org.springframework.samples.petclinic.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration test of the Service and the Repository layer.
 * <p>
 * ClinicServiceSpringDataJpaTests subclasses benefit from the following
 * services provided by the Spring TestContext Framework:
 * </p>
 * <ul>
 * <li><strong>Spring IoC container caching</strong> which spares us unnecessary
 * set up time between test execution.</li>
 * <li><strong>Dependency Injection</strong> of test fixture instances, meaning
 * that we don't need to perform application context lookups. See the use of
 * {@link Autowired @Autowired} on the <code>{@link
 * OwnerServiceTests#clinicService clinicService}</code> instance variable,
 * which uses autowiring <em>by type</em>.
 * <li><strong>Transaction management</strong>, meaning each test method is
 * executed in its own transaction, which is automatically rolled back by
 * default. Thus, even if tests insert or otherwise change database state, there
 * is no need for a teardown or cleanup script.
 * <li>An {@link org.springframework.context.ApplicationContext
 * ApplicationContext} is also inherited and can be used for explicit bean
 * lookup if necessary.</li>
 * </ul>
 *
 * @author Ken Krebs
 * @author Rod Johnson
 * @author Juergen Hoeller
 * @author Sam Brannen
 * @author Michael Isvy
 * @author Dave Syer
 */

@DataJpaTest(includeFilters = @ComponentScan.Filter(Service.class))
class OwnerServiceTests {

	private OwnerService ownerService;
	private PetService petService;

	@Autowired
	public OwnerServiceTests(OwnerService ownerService, PetService petService) {
		this.ownerService = ownerService;
		this.petService = petService;
	}

	@Test
	void shouldFindAllOwners() {
		List<Owner> owners = (List<Owner>) this.ownerService.findAll();
		assertThat(owners.size()).isEqualTo(10);
	}

	@Test
	void shouldFindOwnersByLastName() {
		Collection<Owner> owners = this.ownerService.findOwnerByLastName("Davis");
		assertThat(owners.size()).isEqualTo(2);

		owners = this.ownerService.findOwnerByLastName("Daviss");
		assertThat(owners.isEmpty()).isTrue();
	}

	@Test
	void shouldFindSingleOwnerWithPet() {
		Owner owner = this.ownerService.findOwnerById(1);
		assertThat(owner.getLastName()).startsWith("Franklin");
		assertThat(petService.findAllPetsByOwnerId(owner.getId()).size()).isEqualTo(1);
		assertThat(petService.findAllPetsByOwnerId(owner.getId()).get(0).getType()).isNotNull();
		assertThat(petService.findAllPetsByOwnerId(owner.getId()).get(0).getType().getName()).isEqualTo("cat");
		assertThat(owner.toString()).isNotBlank();
	}

	@Test
	void shouldNotFindSingleOwnerWithBadID() {
		assertThrows(ResourceNotFoundException.class, () -> this.ownerService.findOwnerById(100));
	}

	@Test
	void shouldFindOwnerByUser() {
		Owner owner = this.ownerService.findOwnerByUser(2);
		assertThat(owner.getLastName()).startsWith("Franklin");
		assertThrows(ResourceNotFoundException.class, () -> this.ownerService.findOwnerByUser(34));
	}

	@Test
	void shouldFindOptOwnerByUser() {
		Optional<Owner> owner = this.ownerService.optFindOwnerByUser(2);
		assertThat(owner.get().getLastName()).startsWith("Franklin");
		assertThat(this.ownerService.optFindOwnerByUser(25)).isEmpty();
	}

	@Test
	@Transactional
	void shouldUpdatePlan() {
		Owner owner = this.ownerService.findOwnerById(1);
		assertEquals(owner.getPlan(), PricingPlan.BASIC);
		ownerService.updatePlan(PricingPlan.PLATINUM, 1);
		assertEquals(owner.getPlan(), PricingPlan.PLATINUM);
	}

	@Test
	@Transactional
	void shouldUpdateOwner() {
		Owner owner = this.ownerService.findOwnerById(1);
		owner.setAddress("Change");
		owner.setLastName("Update");
		ownerService.updateOwner(owner, 1);
		owner = this.ownerService.findOwnerById(1);
		assertEquals(owner.getAddress(), "Change");
		assertEquals(owner.getLastName(), "Update");
	}

	@Test
	@Transactional
	void shouldInsertOwner() {
		Collection<Owner> owners = this.ownerService.findOwnerByLastName("Schultz");
		int found = owners.size();

		Owner owner = new Owner();
		owner.setFirstName("Sam");
		owner.setLastName("Schultz");
		owner.setAddress("4, Evans Street");
		owner.setCity("Wollongong");
		owner.setPlan(PricingPlan.BASIC);
		owner.setTelephone("444444444");
		User user = new User();
		user.setUsername("Sam");
		user.setPassword("supersecretpassword");
		owner.setUser(user);

		this.ownerService.saveOwner(owner);
		assertThat(owner.getId().longValue()).isNotEqualTo(0);

		owners = this.ownerService.findOwnerByLastName("Schultz");
		assertThat(owners.size()).isEqualTo(found + 1);
	}

	@Test
	@Transactional
	void shouldDeleteOwner() throws DataAccessException, DuplicatedPetNameException {
		Integer firstCount = ((Collection<Owner>) ownerService.findAll()).size();
		Owner owner = new Owner();
		owner.setFirstName("Sam");
		owner.setLastName("Apellido");
		owner.setAddress("4, Evans Street");
		owner.setCity("Wollongong");
		owner.setPlan(PricingPlan.BASIC);
		owner.setTelephone("444444444");
		User user = new User();
		user.setUsername("Sam");
		user.setPassword("supersecretpassword");
		owner.setUser(user);
		this.ownerService.saveOwner(owner);
		Pet pet = new Pet();
		pet.setName("Sisi");
		pet.setType(petService.findPetTypeByName("dog"));
		pet.setOwner(owner);
		petService.savePet(pet);
		Integer secondCount = ((Collection<Owner>) ownerService.findAll()).size();
		assertEquals(secondCount, firstCount + 1);
		ownerService.deleteOwner(owner.getId());
		Integer lastCount = ((Collection<Owner>) ownerService.findAll()).size();
		assertEquals(firstCount, lastCount);
	}

}
