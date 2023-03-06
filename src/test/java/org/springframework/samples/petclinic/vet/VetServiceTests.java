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
package org.springframework.samples.petclinic.vet;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Collection;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.pet.exceptions.DuplicatedPetNameException;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.util.EntityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration test of the Service and the Repository layer.
 * <p>
 * ClinicServiceSpringDataJpaTests subclasses benefit from the following services provided
 * by the Spring TestContext Framework:
 * </p>
 * <ul>
 * <li><strong>Spring IoC container caching</strong> which spares us unnecessary set up
 * time between test execution.</li>
 * <li><strong>Dependency Injection</strong> of test fixture instances, meaning that we
 * don't need to perform application context lookups. See the use of
 * {@link Autowired @Autowired} on the <code>{@link
 * ClinicServiceTests#clinicService clinicService}</code> instance variable, which uses
 * autowiring <em>by type</em>.
 * <li><strong>Transaction management</strong>, meaning each test method is executed in
 * its own transaction, which is automatically rolled back by default. Thus, even if tests
 * insert or otherwise change database state, there is no need for a teardown or cleanup
 * script.
 * <li>An {@link org.springframework.context.ApplicationContext ApplicationContext} is
 * also inherited and can be used for explicit bean lookup if necessary.</li>
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
class VetServiceTests {

	@Autowired
	protected VetService vetService;	

	@Test
	void shouldFindVets() {
		Collection<Vet> vets = (Collection<Vet>) this.vetService.findAll();

		Vet vet = EntityUtils.getById(vets, Vet.class, 3);
		assertThat(vet.getLastName()).isEqualTo("Douglas");
		assertThat(vet.getSpecialties().size()).isEqualTo(2);
		assertThat(vet.getSpecialties().get(0).getName()).isEqualTo("surgery");
		assertThat(vet.getSpecialties().get(1).getName()).isEqualTo("dentistry");
	}
	
	@Test
	void shouldFindSingleVet() {
		Vet vet = this.vetService.findVetById(1);
		assertThat(vet.getLastName()).startsWith("Carter");
		assertEquals(vet.getCity(),"Sevilla");
		assertEquals(vet.getSpecialties().size(), 0);
	}

	@Test
	void shouldNotFindSingleVetWithBadID() {
		assertThrows(ResourceNotFoundException.class, () -> this.vetService.findVetById(100));
	}

	@Test
	void shouldFindVetByUser() {
		Vet vet = this.vetService.findVetByUser(12);
		assertThat(vet.getLastName()).startsWith("Carter");
		assertThrows(ResourceNotFoundException.class, () -> this.vetService.findVetByUser(34));
	}

	@Test
	void shouldFindOptVetByUser() {
		Optional<Vet> vet = this.vetService.optFindVetByUser(12);
		assertThat(vet.get().getLastName()).startsWith("Carter");
		assertThat(this.vetService.optFindVetByUser(25)).isEmpty();
	}


	@Test
	@Transactional
	void shouldUpdateVet() {
		Vet vet = this.vetService.findVetById(1);
		vet.setCity("Change");
		vet.setLastName("Update");
		vetService.updateVet(vet, 1);
		vet = this.vetService.findVetById(1);
		assertEquals(vet.getCity(), "Change");
		assertEquals(vet.getLastName(), "Update");
	}

	@Test
	@Transactional
	void shouldInsertVet() {
		Collection<Vet> vets = (Collection<Vet>) this.vetService.findAll();
		int found = vets.size();

		Vet vet = new Vet();
		vet.setFirstName("Sam");
		vet.setLastName("Schultz");
		vet.setCity("Wollongong");
		User user = new User();
		user.setUsername("Sam");
		user.setPassword("supersecretpassword");
		vet.setUser(user);

		this.vetService.saveVet(vet);
		assertThat(vet.getId().longValue()).isNotEqualTo(0);

		vets = (Collection<Vet>) this.vetService.findAll();
		assertThat(vets.size()).isEqualTo(found + 1);
	}

	@Test
	@Transactional
	void shouldDeleteVet() throws DataAccessException, DuplicatedPetNameException {
		Integer firstCount = ((Collection<Vet>)this.vetService.findAll()).size();
		Vet vet = new Vet();
		vet.setFirstName("Sam");
		vet.setLastName("Schultz");
		vet.setCity("Wollongong");
		User user = new User();
		user.setUsername("Sam");
		user.setPassword("supersecretpassword");
		vet.setUser(user);
		this.vetService.saveVet(vet);
		
		Integer secondCount = ((Collection<Vet>)this.vetService.findAll()).size();
		assertEquals(secondCount, firstCount + 1);
		vetService.deleteVet(vet.getId());
		Integer lastCount = ((Collection<Vet>)this.vetService.findAll()).size();
		assertEquals(firstCount, lastCount);
	}
	
	// Specialties Tests
	
	@Test
	void shouldFindSpecialties() {
		Collection<Specialty> specialties = (Collection<Specialty>) this.vetService.findSpecialties();

		Specialty specialty = EntityUtils.getById(specialties, Specialty.class, 1);
		assertEquals(specialty.getName(), "radiology");
	}
	
	@Test
	void shouldFindSingleSpecialty() {
		Specialty specialty = this.vetService.findSpecialtyById(1);
		assertEquals(specialty.getName(),"radiology");
	}

	@Test
	void shouldNotFindSingleSpecialtyWithBadID() {
		assertThrows(ResourceNotFoundException.class, () -> this.vetService.findSpecialtyById(100));
	}

	@Test
	@Transactional
	void shouldUpdateSpecialty() {
		Specialty specialty = this.vetService.findSpecialtyById(1);
		specialty.setName("Change");
		vetService.updateSpecialty(specialty, 1);
		specialty = this.vetService.findSpecialtyById(1);
		assertEquals(specialty.getName(), "Change");
	}

	@Test
	@Transactional
	void shouldInsertSpecialty() {
		Collection<Specialty> specialties = (Collection<Specialty>) this.vetService.findSpecialties();
		int found = specialties.size();

		Specialty specialty = new Specialty();
		specialty.setName("Vaccination");
		this.vetService.saveSpecialty(specialty);
		assertThat(specialty.getId().longValue()).isNotEqualTo(0);

		specialties = (Collection<Specialty>) this.vetService.findSpecialties();
		assertThat(specialties.size()).isEqualTo(found + 1);
	}

	@Test
	@Transactional
	void shouldDeleteSpecialty() {
		Integer firstCount = ((Collection<Specialty>)this.vetService.findSpecialties()).size();
		Specialty specialty = new Specialty();
		specialty.setName("Vaccination");
		this.vetService.saveSpecialty(specialty);
		
		Integer secondCount = ((Collection<Specialty>)this.vetService.findSpecialties()).size();
		assertEquals(secondCount, firstCount + 1);
		vetService.deleteSpecialty(specialty.getId());
		Integer lastCount = ((Collection<Specialty>)this.vetService.findSpecialties()).size();
		assertEquals(firstCount, lastCount);
	}


}
