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
package org.springframework.samples.petclinic.pet;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;

import javax.transaction.Transactional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.pet.exceptions.DuplicatedPetNameException;
import org.springframework.samples.petclinic.util.EntityUtils;
import org.springframework.samples.petclinic.visit.Visit;
import org.springframework.samples.petclinic.visit.VisitService;

//@DataJpaTest(includeFilters = @ComponentScan.Filter(Service.class))
@SpringBootTest
@AutoConfigureTestDatabase
class PetServiceTests {
	@Autowired
	protected PetService petService;

	@Autowired
	protected OwnerService ownerService;

	@Autowired
	protected VisitService visitService;

	@Test
	void shouldFindPetWithCorrectId() {
		Pet pet7 = this.petService.findPetById(7);
		assertThat(pet7.getName()).startsWith("Samantha");
		assertEquals("Jean", pet7.getOwner().getFirstName());
	}

	@Test
	void shouldNotFindPetWithInorrectId() {
		assertThrows(ResourceNotFoundException.class, () -> this.petService.findPetById(700));
	}

	@Test
	void shouldFindAllPets() {
		Collection<Pet> pets = this.petService.findAll();

		Pet pet1 = EntityUtils.getById(pets, Pet.class, 1);
		assertEquals("Leo", pet1.getName());
		Pet pet4 = EntityUtils.getById(pets, Pet.class, 4);
		assertEquals("Jewel", pet4.getName());
	}
	
	@Test
	void shouldFindAllPetsByUserId() {
		Collection<Pet> pets = this.petService.findAllPetsByUserId(2);

		Pet pet1 = EntityUtils.getById(pets, Pet.class, 1);
		assertEquals("Leo", pet1.getName());
	}
	
	@Test
	void shouldFindAllPetsByOwnerId() {
		Collection<Pet> pets = this.petService.findAllPetsByOwnerId(1);

		Pet pet1 = EntityUtils.getById(pets, Pet.class, 1);
		assertEquals("Leo", pet1.getName());
	}

	@Test
	void shouldFindAllPetTypes() {
		Collection<PetType> petTypes = this.petService.findPetTypes();

		PetType petType1 = EntityUtils.getById(petTypes, PetType.class, 1);
		assertEquals("cat", petType1.getName());
		PetType petType4 = EntityUtils.getById(petTypes, PetType.class, 4);
		assertEquals("snake", petType4.getName());
	}

	@Test
	void shouldFindPetTypeWithCorrectName() {
		PetType cat = this.petService.findPetTypeByName("cat");
		assertEquals("cat", cat.getName());
	}

	@Test
	void shouldNotFindPetTypeWithIncorrectName() {
		assertThrows(ResourceNotFoundException.class, () -> this.petService.findPetTypeByName("dragon"));
	}

	@Test
	@Transactional
	public void shouldInsertPetIntoDatabaseAndGenerateId() {
		Owner owner6 = this.ownerService.findOwnerById(6);
		int initialCount = petService.findAllPetsByOwnerId(owner6.getId()).size();

		Pet pet = new Pet();
		pet.setName("bowser");
		Collection<PetType> types = this.petService.findPetTypes();
		pet.setType(EntityUtils.getById(types, PetType.class, 2));
		pet.setBirthDate(LocalDate.now());
		pet.setOwner(owner6);
		this.petService.savePet(pet);

		int finalCount = petService.findAllPetsByOwnerId(owner6.getId()).size();

		assertEquals(initialCount + 1, finalCount);
		assertNotNull(pet.getId());
	}

	@Test
	@Transactional
	public void shouldThrowExceptionInsertingPetsWithTheSameName() {
		Owner owner6 = this.ownerService.findOwnerById(6);
		Pet pet = new Pet();
		pet.setName("wario");
		Collection<PetType> types = this.petService.findPetTypes();
		pet.setType(EntityUtils.getById(types, PetType.class, 2));
		pet.setBirthDate(LocalDate.now());
		pet.setOwner(owner6);
		petService.savePet(pet);

		Pet anotherPetWithTheSameName = new Pet();
		anotherPetWithTheSameName.setName("wario");
		anotherPetWithTheSameName.setType(EntityUtils.getById(types, PetType.class, 1));
		anotherPetWithTheSameName.setBirthDate(LocalDate.now().minusWeeks(2));
		anotherPetWithTheSameName.setOwner(owner6);
		assertThrows(DuplicatedPetNameException.class, () -> petService.savePet(anotherPetWithTheSameName));
	}

	@Test
	@Transactional
	public void shouldUpdatePet() {
		Pet pet7 = this.petService.findPetById(7);
		String oldName = pet7.getName();

		String newName = oldName + "X";
		pet7.setName(newName);
		this.petService.updatePet(pet7, pet7.getId());

		pet7 = this.petService.findPetById(7);
		assertEquals(newName, pet7.getName());
	}

	@Test
	@Transactional
	void shouldDeletePetWithVisits() throws DataAccessException, DuplicatedPetNameException {
		Integer firstCount = petService.findAll().size();

		Owner owner6 = this.ownerService.findOwnerById(7);
		Pet pet = new Pet();
		pet.setName("wario22");
		Collection<PetType> types = this.petService.findPetTypes();
		pet.setType(EntityUtils.getById(types, PetType.class, 2));
		pet.setBirthDate(LocalDate.now());
		pet.setOwner(owner6);
		petService.savePet(pet);
		Visit visit = new Visit();
		visit.setDatetime(LocalDateTime.now());
		visit.setDescription("prueba");
		visit.setPet(pet);
		visitService.saveVisit(visit);

		Integer secondCount = petService.findAll().size();
		assertEquals(firstCount + 1, secondCount);
		petService.deletePet(pet.getId());
		Integer lastCount = petService.findAll().size();
		assertEquals(firstCount, lastCount);
	}

	@Test
	void shouldCheckLimitForBasic() {
		Owner owner = this.ownerService.findOwnerById(4);
		assertEquals(true, this.petService.underLimit(owner));
		createPet("wario", owner);
		assertEquals(false, this.petService.underLimit(owner));
	}

	@Test
	void shouldCheckLimitForGold() {
		Owner owner = this.ownerService.findOwnerById(7);
		assertEquals(true, this.petService.underLimit(owner));
		createPet("wario", owner);
		createPet("wario2", owner);
		createPet("wario3", owner);
		assertEquals(false, this.petService.underLimit(owner));
	}

	@Test
	void shouldCheckLimitForPlatinum() {
		Owner owner = this.ownerService.findOwnerById(8);
		assertEquals(true, this.petService.underLimit(owner));
		createPet("wario", owner);
		createPet("wario2", owner);
		createPet("wario3", owner);
		createPet("wario4", owner);
		createPet("wario5", owner);
		createPet("wario6", owner);
		assertEquals(false, this.petService.underLimit(owner));
	}

	private void createPet(String name, Owner owner) {
		PetType type = this.petService.findPetTypeByName("cat");
		Pet pet = new Pet();
		pet.setName(name);
		pet.setType(type);
		pet.setBirthDate(LocalDate.now());
		pet.setOwner(owner);
		petService.savePet(pet);
	}

}
