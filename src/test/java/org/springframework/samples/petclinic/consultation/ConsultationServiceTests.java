package org.springframework.samples.petclinic.consultation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Collection;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.util.EntityUtils;
import org.springframework.samples.petclinic.util.TicketStatus;
import org.springframework.transaction.annotation.Transactional;

//@DataJpaTest(includeFilters = @ComponentScan.Filter(Service.class))
@SpringBootTest
@AutoConfigureTestDatabase
public class ConsultationServiceTests {

	@Autowired
	protected ConsultationService consultationService;
	
	@Autowired
	protected OwnerService ownerService;

	@Test
	void shouldFindAllConsultations() {
		Collection<Consultation> consultations = (Collection<Consultation>) this.consultationService.findAll();

		Consultation c1 = EntityUtils.getById(consultations, Consultation.class, 1);
		assertEquals("owner1", c1.getOwner().getUser().getUsername());
		Consultation c3 = EntityUtils.getById(consultations, Consultation.class, 3);
		assertEquals("Mi gato no come", c3.getTitle());
	}

	@Test
	void shouldFindConsultationsByOwnerId() {
		Collection<Consultation> consultations = (Collection<Consultation>) this.consultationService.findAllConsultationsByOwner(1);

		Consultation c1 = EntityUtils.getById(consultations, Consultation.class, 1);
		assertEquals("owner1", c1.getOwner().getUser().getUsername());
		Consultation c2 = EntityUtils.getById(consultations, Consultation.class, 2);
		assertEquals("Mi perro se pone nervioso", c2.getTitle());
	}
	
//	@Test
//	void shouldFindConsultationsByUserId() {
//		Collection<Consultation> consultations = (Collection<Consultation>) this.consultationService.findAllConsultationsByUser(2);
//
//		Consultation c1 = EntityUtils.getById(consultations, Consultation.class, 1);
//		assertEquals("owner1", c1.getOwner().getUser().getUsername());
//		Consultation c2 = EntityUtils.getById(consultations, Consultation.class, 2);
//		assertEquals("Mi perro se pone nervioso", c2.getTitle());
//	}
//

	@Test
	void shouldFindConsultationWithCorrectId() {
		Consultation consultation = this.consultationService.findConsultationById(1);
		assertEquals("owner1", consultation.getOwner().getUser().getUsername());
	}

	@Test
	void shouldNotFindConsultationWithIncorrectId() {
		assertThrows(ResourceNotFoundException.class, () -> this.consultationService.findConsultationById(700));
	}
	
	@Test
	@Transactional
	void shouldInsertConsultation() {
		int initialCount = ((Collection<Consultation>) this.consultationService.findAll()).size();
		
		Consultation cons = new Consultation();
		cons.setTitle("Consulta de prueba");
		cons.setStatus(TicketStatus.PENDING);
		cons.setOwner(this.ownerService.findOwnerById(2));
		
		this.consultationService.saveConsultation(cons);
		assertThat(cons.getId().longValue()).isNotEqualTo(0);
		
		int finalCount = ((Collection<Consultation>) this.consultationService.findAll()).size();
		assertEquals(initialCount + 1, finalCount);
	}

	@Test
	@Transactional
	void shouldUpdateConsultation() {
		Consultation cons = this.consultationService.findConsultationById(1);
		cons.setTitle("Change");
		cons.setStatus(TicketStatus.ANSWERED);
		consultationService.updateConsultation(cons, 1);
		cons = this.consultationService.findConsultationById(1);
		assertEquals("Change", cons.getTitle());
		assertEquals(TicketStatus.ANSWERED, cons.getStatus());
	}


	@Test
	@Transactional
	void shouldDeleteConsultationWithTickets() throws DataAccessException {
		int initialCount = ((Collection<Consultation>) this.consultationService.findAll()).size();

		Consultation cons = new Consultation();
		cons.setTitle("Consulta de prueba");
		cons.setStatus(TicketStatus.PENDING);
		cons.setOwner(this.ownerService.findOwnerById(2));
		this.consultationService.saveConsultation(cons);
		
		Ticket ticket = new Ticket();
		ticket.setConsultation(cons);
		ticket.setDescription("Prueba");
		ticket.setUser(ownerService.findOwnerById(1).getUser());
		this.consultationService.saveTicket(ticket);

		Integer secondCount = ((Collection<Consultation>) this.consultationService.findAll()).size();
		assertEquals(initialCount + 1, secondCount);
		consultationService.deleteConsultation(cons.getId());
		Integer lastCount = ((Collection<Consultation>) this.consultationService.findAll()).size();
		assertEquals(initialCount, lastCount);
	}
	
	@Test
	void shouldFindAllTicketsByConsultation() {
		Collection<Ticket> tickets = (Collection<Ticket>) this.consultationService.findAllTicketsByConsultation(1);

		Ticket t1 = EntityUtils.getById(tickets, Ticket.class, 1);
		assertEquals("¿Qué vacuna le pongo?", t1.getDescription());
		Ticket t2 = EntityUtils.getById(tickets, Ticket.class, 2);
		assertEquals("La de la rabia.", t2.getDescription());
	}

	@Test
	void shouldFindTicketWithCorrectId() {
		Ticket t = this.consultationService.findTicketById(1);
		assertEquals("¿Qué vacuna le pongo?", t.getDescription());
	}

	@Test
	void shouldNotFindTicektWithIncorrectId() {
		assertThrows(ResourceNotFoundException.class, () -> this.consultationService.findTicketById(700));
	}
	
	@Test
	@Transactional
	void shouldInsertTicket() {
		int initialCount = ((Collection<Ticket>) this.consultationService.findAllTicketsByConsultation(1)).size();
		
		Ticket t = new Ticket();
		t.setDescription("Consulta de prueba");
		t.setConsultation(this.consultationService.findConsultationById(1));
		t.setUser(this.ownerService.findOwnerById(1).getUser());
		
		this.consultationService.saveTicket(t);
		assertThat(t.getId().longValue()).isNotEqualTo(0);
		
		int finalCount = ((Collection<Ticket>) this.consultationService.findAllTicketsByConsultation(1)).size();
		assertEquals(initialCount + 1, finalCount);
	}

	@Test
	@Transactional
	void shouldUpdateTicket() {
		Ticket t = this.consultationService.findTicketById(1);
		t.setDescription("Change");
		consultationService.updateTicket(t, 1);
		t = this.consultationService.findTicketById(1);
		assertEquals("Change", t.getDescription());
	}


	@Test
	@Transactional
	void shouldDeleteTicket() throws DataAccessException {
		int initialCount = ((Collection<Ticket>) this.consultationService.findAllTicketsByConsultation(1)).size();

		Ticket t = new Ticket();
		t.setDescription("Consulta de prueba");
		t.setConsultation(this.consultationService.findConsultationById(1));
		t.setUser(this.ownerService.findOwnerById(1).getUser());
		this.consultationService.saveTicket(t);

		Integer secondCount = ((Collection<Ticket>) this.consultationService.findAllTicketsByConsultation(1)).size();
		assertEquals(initialCount + 1, secondCount);
		consultationService.deleteTicket(t.getId());
		Integer lastCount = ((Collection<Ticket>) this.consultationService.findAllTicketsByConsultation(1)).size();
		assertEquals(initialCount, lastCount);
	}
//
//	@Test
//	void shouldCheckLimitForBasic() {
//		Consultation v = createVisit(1);
//		assertEquals(true, this.consultationService.underLimit(v));
//		this.consultationService.saveVisit(v);
//		v = createVisit(1);
//		assertEquals(false, this.consultationService.underLimit(v));
//	}
//
//	@Test
//	void shouldCheckLimitForGold() {
//		Consultation v = createVisit(9);
//		assertEquals(true, this.consultationService.underLimit(v));
//		this.consultationService.saveVisit(v);
//		v = createVisit(9);
//		assertEquals(true, this.consultationService.underLimit(v));
//		this.consultationService.saveVisit(v);
//		v = createVisit(9);
//		assertEquals(true, this.consultationService.underLimit(v));
//		this.consultationService.saveVisit(v);
//		v = createVisit(9);
//		assertEquals(false, this.consultationService.underLimit(v));
//	}
//
//	@Test
//	void shouldCheckLimitForPlatinum() {
//		Consultation v = createVisit(10);
//		assertEquals(true, this.consultationService.underLimit(v));
//		this.consultationService.saveVisit(v);
//		v = createVisit(10);
//		this.consultationService.saveVisit(v);
//		v = createVisit(10);
//		this.consultationService.saveVisit(v);
//		v = createVisit(10);
//		this.consultationService.saveVisit(v);
//		v = createVisit(10);
//		this.consultationService.saveVisit(v);
//		v = createVisit(10);
//		assertEquals(true, this.consultationService.underLimit(v));
//		this.consultationService.saveVisit(v);
//		v = createVisit(10);
//		assertEquals(false, this.consultationService.underLimit(v));
//	}
//
//	private Consultation createVisit(int pet) {
//		Consultation visit = new Consultation();
//		visit.setDatetime(LocalDateTime.now());
//		visit.setDescription("prueba");
//		visit.setPet(this.petService.findPetById(pet));
//		visit.setVet(this.vetService.findVetById(1));
//		return visit;
//	}

}
