package org.springframework.samples.petclinic.consultation;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Collection;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.AccessDeniedException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.exceptions.ResourceNotOwnedException;
import org.springframework.samples.petclinic.exceptions.UpperPlanFeatureException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.util.EntityUtils;
import org.springframework.samples.petclinic.util.TicketStatus;
import org.springframework.samples.petclinic.vet.VetService;
import org.springframework.transaction.annotation.Transactional;

//@DataJpaTest(includeFilters = @ComponentScan.Filter(Service.class))
@SpringBootTest
@AutoConfigureTestDatabase
public class ConsultationServiceTests {

	@Autowired
	protected ConsultationService consultationService;

	@Autowired
	protected OwnerService ownerService;

	@Autowired
	protected VetService vetService;

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
		Collection<Consultation> consultations = (Collection<Consultation>) this.consultationService
				.findAllConsultationsByOwner(1);

		Consultation c1 = EntityUtils.getById(consultations, Consultation.class, 1);
		assertEquals("owner1", c1.getOwner().getUser().getUsername());
		Consultation c2 = EntityUtils.getById(consultations, Consultation.class, 2);
		assertEquals("Mi perro se pone nervioso", c2.getTitle());
	}

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
		Assertions.assertThat(cons.getId().longValue()).isNotEqualTo(0);

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
		Assertions.assertThat(t.getId().longValue()).isNotEqualTo(0);

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

	@Test
	void shouldDoNothingLastTicketNotClosed() {
		Consultation cons = this.consultationService.findConsultationById(1);
		Ticket t = this.consultationService.findTicketById(2);
		assertDoesNotThrow(() -> this.consultationService.checkLastTicketAndStatus(cons, t));
	}

	@Test
	void shouldThrowNotLastTicket() {
		Consultation cons = this.consultationService.findConsultationById(1);
		Ticket t = this.consultationService.findTicketById(1);
		AccessDeniedException e = assertThrows(AccessDeniedException.class,
				() -> this.consultationService.checkLastTicketAndStatus(cons, t));
		assertEquals("You can only update or delete the last ticket in a consultation!", e.getMessage());
	}

	@Test
	void shouldThrowClosedConsultation() {
		Consultation cons = this.consultationService.findConsultationById(4);
		Ticket t = this.consultationService.findTicketById(8);
		AccessDeniedException e = assertThrows(AccessDeniedException.class,
				() -> this.consultationService.checkLastTicketAndStatus(cons, t));
		assertEquals("This consultation is closed!", e.getMessage());
	}

	@Test
	@Transactional
	void shouldUpdateOwnerTicket() {
		Ticket ticket = this.consultationService.findTicketById(4);
		ticket.setDescription("Updated");
		Consultation c = this.consultationService.findConsultationById(2);
		Owner o = this.ownerService.findOwnerById(1);
		User currentUser = o.getUser();
		Ticket response = this.consultationService
				.updateOwnerTicket(ticket, this.consultationService.findTicketById(4), c, currentUser, o).getBody();
		assertEquals("Updated", response.getDescription());
	}

	@Test
	@Transactional
	void shouldNotUpdateOwnerTicketTicketNotOwned() {
		Ticket ticket = this.consultationService.findTicketById(4);
		ticket.setDescription("Updated");
		Consultation c = this.consultationService.findConsultationById(2);
		Owner o = this.ownerService.findOwnerById(1);
		User currentUser = this.ownerService.findOwnerById(2).getUser();
		ResourceNotOwnedException response = assertThrows(ResourceNotOwnedException.class,
				() -> this.consultationService.updateOwnerTicket(ticket, this.consultationService.findTicketById(4), c,
						currentUser, o));
		assertEquals("Ticket not owned.", response.getMessage());
	}

	@Test
	@Transactional
	void shouldNotUpdateOwnerTicketConsultationNotOwned() {
		Ticket ticket = this.consultationService.findTicketById(4);
		ticket.setDescription("Updated");
		Consultation c = this.consultationService.findConsultationById(2);
		Owner o = this.ownerService.findOwnerById(2);
		User currentUser = o.getUser();
		ResourceNotOwnedException response = assertThrows(ResourceNotOwnedException.class,
				() -> this.consultationService.updateOwnerTicket(ticket, this.consultationService.findTicketById(4), c,
						currentUser, o));
		assertEquals("Consultation not owned.", response.getMessage());
	}

	@Test
	@Transactional
	void shouldNotUpdateOwnerTicketNotPlatinum() {
		Ticket ticket = this.consultationService.findTicketById(4);
		ticket.setDescription("Updated");
		Consultation c = this.consultationService.findConsultationById(2);
		User currentUser = this.ownerService.findOwnerById(2).getUser();
		Owner o = this.ownerService.findOwnerById(4);
		UpperPlanFeatureException response = assertThrows(UpperPlanFeatureException.class,
				() -> this.consultationService.updateOwnerTicket(ticket, this.consultationService.findTicketById(4), c,
						currentUser, o));
		assertEquals("You need to be subscribed to plan PLATINUM to access this feature and you have plan BASIC.",
				response.getMessage());
	}

	@Test
	@Transactional
	void shouldUpdateVetTicket() {
		Ticket ticket = this.consultationService.findTicketById(2);
		ticket.setDescription("Updated");
		Consultation c = this.consultationService.findConsultationById(1);
		User currentUser = this.vetService.findVetById(1).getUser();
		Ticket response = this.consultationService
				.updateVetTicket(ticket, this.consultationService.findTicketById(2), c, currentUser).getBody();
		assertEquals("Updated", response.getDescription());
	}

	@Test
	@Transactional
	void shouldNotUpdateVetTicketTicketNotOwned() {
		Ticket ticket = this.consultationService.findTicketById(2);
		ticket.setDescription("Updated");
		Consultation c = this.consultationService.findConsultationById(1);
		User currentUser = this.vetService.findVetById(2).getUser();
		ResourceNotOwnedException response = assertThrows(ResourceNotOwnedException.class,
				() -> this.consultationService.updateVetTicket(ticket, this.consultationService.findTicketById(2), c,
						currentUser));
		assertEquals("Ticket not owned.", response.getMessage());
	}

	@Test
	@Transactional
	void shouldDeleteOwnerTicket() {
		final int CONSULTATION_ID = 2;
		Integer initialCount = ((Collection<Ticket>) this.consultationService
				.findAllTicketsByConsultation(CONSULTATION_ID)).size();
		Consultation c = this.consultationService.findConsultationById(CONSULTATION_ID);
		Owner o = this.ownerService.findOwnerById(1);
		User currentUser = o.getUser();
		Ticket t = new Ticket();
		t.setDescription("Consulta de prueba");
		t.setConsultation(c);
		t.setUser(this.ownerService.findOwnerById(1).getUser());
		this.consultationService.saveTicket(t);

		Integer secondCount = ((Collection<Ticket>) this.consultationService
				.findAllTicketsByConsultation(CONSULTATION_ID)).size();
		assertEquals(initialCount + 1, secondCount);

		this.consultationService.deleteOwnerTicket(t, c, currentUser, o);
		Integer lastCount = ((Collection<Ticket>) this.consultationService
				.findAllTicketsByConsultation(CONSULTATION_ID)).size();
		assertEquals(initialCount, lastCount);
	}

	@Test
	@Transactional
	void shouldNotDeleteOwnerTicketTicketNotOwned() {
		Consultation c = this.consultationService.findConsultationById(1);
		Owner o = this.ownerService.findOwnerById(1);
		User currentUser = o.getUser();
		Ticket t = new Ticket();
		t.setDescription("Consulta de prueba");
		t.setConsultation(c);
		t.setUser(this.vetService.findVetById(1).getUser());
		this.consultationService.saveTicket(t);

		ResourceNotOwnedException response = assertThrows(ResourceNotOwnedException.class,
				() -> this.consultationService.deleteOwnerTicket(t, c, currentUser, o));
		assertEquals("Ticket not owned.", response.getMessage());
	}

	@Test
	@Transactional
	void shouldNotDeleteOwnerTicketConsultationNotOwned() {
		Consultation c = this.consultationService.findConsultationById(1);
		Owner o = this.ownerService.findOwnerById(2);
		User currentUser = o.getUser();
		Ticket t = new Ticket();
		t.setDescription("Consulta de prueba");
		t.setConsultation(c);
		t.setUser(this.vetService.findVetById(1).getUser());
		this.consultationService.saveTicket(t);

		ResourceNotOwnedException response = assertThrows(ResourceNotOwnedException.class,
				() -> this.consultationService.deleteOwnerTicket(t, c, currentUser, o));
		assertEquals("Consultation not owned.", response.getMessage());
	}

	@Test
	@Transactional
	void shouldNotDeleteOwnerTicketNotPlatinum() {
		Consultation c = this.consultationService.findConsultationById(1);
		Owner o = this.ownerService.findOwnerById(4);
		User currentUser = o.getUser();
		Ticket t = new Ticket();
		t.setDescription("Consulta de prueba");
		t.setConsultation(c);
		t.setUser(this.vetService.findVetById(1).getUser());
		this.consultationService.saveTicket(t);

		UpperPlanFeatureException response = assertThrows(UpperPlanFeatureException.class,
				() -> this.consultationService.deleteOwnerTicket(t, c, currentUser, o));
		assertEquals("You need to be subscribed to plan PLATINUM to access this feature and you have plan BASIC.",
				response.getMessage());
	}

	@Test
	@Transactional
	void shouldDeleteVetTicket() {
		final int CONSULTATION_ID = 1;
		Integer initialCount = ((Collection<Ticket>) this.consultationService
				.findAllTicketsByConsultation(CONSULTATION_ID)).size();
		Consultation c = this.consultationService.findConsultationById(CONSULTATION_ID);
		User currentUser = this.vetService.findVetById(1).getUser();
		Ticket t = new Ticket();
		t.setDescription("Consulta de prueba");
		t.setConsultation(c);
		t.setUser(currentUser);
		this.consultationService.saveTicket(t);

		Integer secondCount = ((Collection<Ticket>) this.consultationService
				.findAllTicketsByConsultation(CONSULTATION_ID)).size();
		assertEquals(initialCount + 1, secondCount);

		this.consultationService.deleteVetTicket(t, c, currentUser);
		Integer lastCount = ((Collection<Ticket>) this.consultationService
				.findAllTicketsByConsultation(CONSULTATION_ID)).size();
		assertEquals(initialCount, lastCount);
	}

	@Test
	@Transactional
	void shouldNotDeleteVetTicketTicketNotOwned() {
		Consultation c = this.consultationService.findConsultationById(1);
		User currentUser = this.vetService.findVetById(1).getUser();
		Ticket t = new Ticket();
		t.setDescription("Consulta de prueba");
		t.setConsultation(c);
		t.setUser(this.vetService.findVetById(2).getUser());
		this.consultationService.saveTicket(t);

		ResourceNotOwnedException response = assertThrows(ResourceNotOwnedException.class,
				() -> this.consultationService.deleteVetTicket(t, c, currentUser));
		assertEquals("Ticket not owned.", response.getMessage());
	}

	@Test
	@Transactional
	void shouldDoNothingTicketInConsultation() {
		Consultation c = this.consultationService.findConsultationById(1);
		Ticket t = this.consultationService.findTicketById(1);

		assertDoesNotThrow(() -> this.consultationService.checkIfTicketInConsultation(c, t));
	}

	@Test
	@Transactional
	void shouldThrowTicketNotInConsultation() {
		Consultation c = this.consultationService.findConsultationById(1);
		Ticket t = this.consultationService.findTicketById(6);

		AccessDeniedException e = assertThrows(AccessDeniedException.class,
				() -> this.consultationService.checkIfTicketInConsultation(c, t));
		assertEquals(String.format("The ticket %s doesn't belong to the consultation %s.", t.getId(), c.getId()),
				e.getMessage());
	}

}
