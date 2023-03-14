package org.springframework.samples.petclinic.visit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.util.Collection;

import javax.transaction.Transactional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.pet.PetService;
import org.springframework.samples.petclinic.pet.exceptions.DuplicatedPetNameException;
import org.springframework.samples.petclinic.util.EntityUtils;
import org.springframework.samples.petclinic.vet.VetService;

//@DataJpaTest(includeFilters = @ComponentScan.Filter(Service.class))
@SpringBootTest
@AutoConfigureTestDatabase
public class VisitServiceTests {

	@Autowired
	protected PetService petService;

	@Autowired
	protected OwnerService ownerService;

	@Autowired
	protected VisitService visitService;

	@Autowired
	protected VetService vetService;

	@Test
	void shouldFindAllVisits() {
		Collection<Visit> visits = (Collection<Visit>) this.visitService.findAll();

		Visit v1 = EntityUtils.getById(visits, Visit.class, 1);
		assertEquals("Samantha", v1.getPet().getName());
		Visit v3 = EntityUtils.getById(visits, Visit.class, 3);
		assertEquals("Max", v3.getPet().getName());
	}

	@Test
	void shouldFindVisitsByOwnerId() {
		Collection<Visit> visits = (Collection<Visit>) this.visitService.findVisitsByOwnerId(6);

		Visit v1 = EntityUtils.getById(visits, Visit.class, 1);
		assertEquals("Samantha", v1.getPet().getName());
		Visit v3 = EntityUtils.getById(visits, Visit.class, 3);
		assertEquals("Max", v3.getPet().getName());
	}

	@Test
	void shouldFindVisitsByPetId() {
		Collection<Visit> visits = (Collection<Visit>) this.visitService.findVisitsByPetId(7);

		Visit v1 = EntityUtils.getById(visits, Visit.class, 1);
		assertEquals("Samantha", v1.getPet().getName());
		Visit v4 = EntityUtils.getById(visits, Visit.class, 4);
		assertEquals("Samantha", v4.getPet().getName());
	}

	@Test
	void shouldFindVisitWithCorrectId() {
		Visit visit = this.visitService.findVisitById(1);
		assertEquals("Samantha", visit.getPet().getName());
	}

	@Test
	void shouldNotFindVisitWithInorrectId() {
		assertThrows(ResourceNotFoundException.class, () -> this.visitService.findVisitById(700));
	}

	@Test
	@Transactional
	void shouldUpdateVisit() {
		Visit visit = this.visitService.findVisitById(1);
		visit.setDescription("Change");
		visitService.updateVisit(visit, 1);
		visit = this.visitService.findVisitById(1);
		assertEquals("Change", visit.getDescription());
	}

	@Test
	@Transactional
	void shouldInsertOwner() {
		int initialCount = ((Collection<Visit>) this.visitService.findAll()).size();

		Visit visit = new Visit();
		visit.setDate(LocalDate.now());
		visit.setDescription("prueba");
		visit.setPet(this.petService.findPetById(1));
		visit.setVet(this.vetService.findVetById(1));

		this.visitService.saveVisit(visit);
		assertThat(visit.getId().longValue()).isNotEqualTo(0);

		int finalCount = ((Collection<Visit>) this.visitService.findAll()).size();
		assertEquals(initialCount + 1, finalCount);
	}

	@Test
	@Transactional
	void shouldDeleteVisit() throws DataAccessException, DuplicatedPetNameException {
		int initialCount = ((Collection<Visit>) this.visitService.findAll()).size();

		Visit visit = new Visit();
		visit.setDate(LocalDate.now());
		visit.setDescription("prueba");
		visit.setPet(this.petService.findPetById(1));
		visit.setVet(this.vetService.findVetById(1));
		this.visitService.saveVisit(visit);

		Integer secondCount = ((Collection<Visit>) this.visitService.findAll()).size();
		assertEquals(initialCount + 1, secondCount);
		visitService.deleteVisit(visit.getId());
		Integer lastCount = ((Collection<Visit>) this.visitService.findAll()).size();
		assertEquals(initialCount, lastCount);
	}

	@Test
	void shouldCheckLimitForBasic() {
		Visit v = createVisit(1);
		assertEquals(true, this.visitService.underLimit(v));
		this.visitService.saveVisit(v);
		v = createVisit(1);
		assertEquals(false, this.visitService.underLimit(v));
	}

	@Test
	void shouldCheckLimitForGold() {
		Visit v = createVisit(9);
		assertEquals(true, this.visitService.underLimit(v));
		this.visitService.saveVisit(v);
		v = createVisit(9);
		assertEquals(true, this.visitService.underLimit(v));
		this.visitService.saveVisit(v);
		v = createVisit(9);
		assertEquals(true, this.visitService.underLimit(v));
		this.visitService.saveVisit(v);
		v = createVisit(9);
		assertEquals(false, this.visitService.underLimit(v));
	}

	@Test
	void shouldCheckLimitForPlatinum() {
		Visit v = createVisit(10);
		assertEquals(true, this.visitService.underLimit(v));
		this.visitService.saveVisit(v);
		v = createVisit(10);
		this.visitService.saveVisit(v);
		v = createVisit(10);
		this.visitService.saveVisit(v);
		v = createVisit(10);
		this.visitService.saveVisit(v);
		v = createVisit(10);
		this.visitService.saveVisit(v);
		v = createVisit(10);
		assertEquals(true, this.visitService.underLimit(v));
		this.visitService.saveVisit(v);
		v = createVisit(10);
		assertEquals(false, this.visitService.underLimit(v));
	}

	private Visit createVisit(int pet) {
		Visit visit = new Visit();
		visit.setDate(LocalDate.now());
		visit.setDescription("prueba");
		visit.setPet(this.petService.findPetById(pet));
		visit.setVet(this.vetService.findVetById(1));
		return visit;
	}

}
