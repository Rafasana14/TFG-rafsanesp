package org.springframework.samples.petclinic.consultation;

import java.net.URISyntaxException;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.exceptions.AccessDeniedException;
import org.springframework.samples.petclinic.exceptions.ResourceNotOwnedException;
import org.springframework.samples.petclinic.exceptions.UpperPlanFeatureException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.PricingPlan;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.util.TicketStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import petclinic.payload.response.MessageResponse;

@RestController
@RequestMapping("/api/v1/consultations")
public class ConsultationController {

	private final ConsultationService consultationService;
	private final UserService userService;
	private final String OWNER = "OWNER";

	@Autowired
	public ConsultationController(ConsultationService consultationService, UserService userService) {
		this.consultationService = consultationService;
		this.userService = userService;
	}

	@GetMapping
	public List<Consultation> findAllConsultations() {
		User user = userService.findCurrentUser();
		if (user.hasAnyAuthority("VET", "ADMIN")) {
			return (List<Consultation>) consultationService.findAll();
		} else {
			Owner owner = userService.findOwnerByUser(user.getId());
			return (List<Consultation>) consultationService.findAllConsultationsByOwner(owner.getId());
		}
	}

	@GetMapping(value = "{consultationId}")
	public ResponseEntity<Consultation> findConsultationById(@PathVariable("consultationId") int id) {
		User user = userService.findCurrentUser();
		Consultation cons = this.consultationService.findConsultationById(id);
		if (user.hasAnyAuthority("ADMIN", "VET"))
			return new ResponseEntity<Consultation>(cons, HttpStatus.OK);
		else {
			Owner owner = userService.findOwnerByUser(user.getId());
			if (cons.getOwner().getId().equals(owner.getId()))
				return new ResponseEntity<Consultation>(cons, HttpStatus.OK);
		}
		throw new AccessDeniedException();
	}

	@PostMapping()
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Consultation> createConsultation(@RequestBody @Valid Consultation consultation)
			throws URISyntaxException {
		User user = userService.findCurrentUser();
		Consultation newConsultation = new Consultation();
		Consultation savedConsultation;
		BeanUtils.copyProperties(consultation, newConsultation, "id");
		if (user.hasAuthority(OWNER)) {
			Owner owner = userService.findOwnerByUser(user.getUsername());
			if (owner.getPlan().equals(PricingPlan.PLATINUM)) {
				newConsultation.setOwner(owner);
				newConsultation.setStatus(TicketStatus.PENDING);
				savedConsultation = this.consultationService.saveConsultation(newConsultation);
			} else
				throw new UpperPlanFeatureException(PricingPlan.PLATINUM, owner.getPlan());
		} else {
			savedConsultation = this.consultationService.saveConsultation(newConsultation);
		}

//		return ResponseEntity.created(new URI("/api/v1/pets/" + savedPet.getId())).body(savedPet);
		return new ResponseEntity<Consultation>(savedConsultation, HttpStatus.CREATED);
	}

	@PutMapping(value = "{consultationId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Consultation> updateConsultation(@PathVariable("consultationId") int consultationId,
			@RequestBody @Valid Consultation consultation) {
		Consultation aux = consultationService.findConsultationById(consultationId);
		User user = userService.findCurrentUser();
		if (user.hasAuthority(OWNER)) {
			Owner owner = userService.findOwnerByUser(user.getUsername());
			if (owner.getPlan().equals(PricingPlan.PLATINUM)) {
				if (owner.getId().equals(aux.getOwner().getId()))
					return new ResponseEntity<Consultation>(
							this.consultationService.updateConsultation(consultation, consultationId), HttpStatus.OK);
				else
					throw new ResourceNotOwnedException("Consultation");
			} else
				throw new UpperPlanFeatureException(PricingPlan.PLATINUM, owner.getPlan());
		} else {
			return new ResponseEntity<Consultation>(
					this.consultationService.updateConsultation(consultation, consultationId), HttpStatus.OK);
		}
	}

	@DeleteMapping(value = "{consultationId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<MessageResponse> deleteConsultation(@PathVariable("consultationId") int id) {
		consultationService.deleteConsultation(id);
		return new ResponseEntity<MessageResponse>(new MessageResponse("Consultation deleted!"), HttpStatus.OK);
	}

	@GetMapping(value = "{consultationId}/tickets")
	public List<Ticket> findAllTicketsByConsultation(@PathVariable("consultationId") int id) {
		Consultation cons = consultationService.findConsultationById(id);
		User user = userService.findCurrentUser();
		if (user.hasAuthority(OWNER)) {
			Owner owner = userService.findOwnerByUser(user.getId());
			if (cons.getOwner().getId().equals(owner.getId()))
				return (List<Ticket>) consultationService.findAllTicketsByConsultation(id);
			else
				throw new AccessDeniedException();
		} else {
			return (List<Ticket>) consultationService.findAllTicketsByConsultation(id);
		}
	}

	@GetMapping(value = "{consultationId}/tickets/{ticketId}")
	public ResponseEntity<Ticket> findTicketById(@PathVariable("consultationId") int consultationId,
			@PathVariable("ticketId") int ticketId) {
		Consultation cons = consultationService.findConsultationById(consultationId);
		User user = userService.findCurrentUser();
		Ticket ticket = this.consultationService.findTicketById(ticketId);
		if (user.hasAuthority(OWNER)) {
			Owner owner = userService.findOwnerByUser(user.getId());
			if (cons.getOwner().getId().equals(owner.getId()))
				return new ResponseEntity<Ticket>(ticket, HttpStatus.OK);
			else
				throw new AccessDeniedException();
		} else {
			return new ResponseEntity<Ticket>(ticket, HttpStatus.OK);
		}
	}

	@PostMapping(value = "{consultationId}/tickets")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Ticket> createTicket(@PathVariable("consultationId") int consultationId,
			@RequestBody @Valid Ticket ticket) throws URISyntaxException {
		User user = userService.findCurrentUser();
		Consultation cons = consultationService.findConsultationById(consultationId);
		Ticket newTicket = new Ticket();
		Ticket savedTicket;
		BeanUtils.copyProperties(ticket, newTicket, "id");
		if (user.hasAuthority(OWNER)) {
			Owner owner = userService.findOwnerByUser(user.getUsername());
			if (owner.getPlan().equals(PricingPlan.PLATINUM)) {
				if (owner.getId().equals(cons.getOwner().getId())) {
					cons.setStatus(TicketStatus.PENDING);
					this.consultationService.saveConsultation(cons);
					newTicket.setUser(user);
					newTicket.setConsultation(cons);
					savedTicket = this.consultationService.saveTicket(newTicket);

				} else
					throw new AccessDeniedException();
			} else
				throw new UpperPlanFeatureException(PricingPlan.PLATINUM, owner.getPlan());
		} else {
			cons.setStatus(TicketStatus.ANSWERED);
			this.consultationService.saveConsultation(cons);
			newTicket.setUser(user);
			newTicket.setConsultation(cons);
			savedTicket = this.consultationService.saveTicket(newTicket);
		}

		// return ResponseEntity.created(new URI("/api/v1/pets/" +
		// savedPet.getId())).body(savedPet);
		return new ResponseEntity<Ticket>(savedTicket, HttpStatus.CREATED);
	}

	@PutMapping(value = "{consultationId}/tickets/{ticketId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Ticket> updateTicket(@PathVariable("consultationId") int consultationId,
			@PathVariable("ticketId") int ticketId, @RequestBody @Valid Ticket ticket) {
		Consultation consultation = consultationService.findConsultationById(consultationId);
		Ticket aux = consultationService.findTicketById(ticketId);
		this.consultationService.checkLastTicketAndStatus(consultation, aux);
		User user = userService.findCurrentUser();
		if (user.hasAuthority(OWNER)) {
			Owner owner = userService.findOwnerByUser(user.getUsername());
			return this.consultationService.updateOwnerTicket(ticket, aux, consultation, user, owner);
		} else if (user.hasAuthority("VET")) {
			return this.consultationService.updateVetTicket(ticket, aux, consultation, user);
		} else {
			return new ResponseEntity<Ticket>(this.consultationService.updateTicket(ticket, ticketId), HttpStatus.OK);
		}
	}

	@DeleteMapping(value = "{consultationId}/tickets/{ticketId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<MessageResponse> deleteTicket(@PathVariable("consultationId") int consultationId,
			@PathVariable("ticketId") int ticketId) {
		Consultation consultation = consultationService.findConsultationById(consultationId);
		Ticket ticket = this.consultationService.findTicketById(ticketId);
		this.consultationService.checkLastTicketAndStatus(consultation, ticket);
		User user = userService.findCurrentUser();
		if (user.hasAuthority(OWNER)) {
			Owner owner = userService.findOwnerByUser(user.getUsername());
			this.consultationService.deleteOwnerTicket(ticket, consultation, user, owner);
		} else if (user.hasAuthority("VET")) {
			this.consultationService.deleteVetTicket(ticket, consultation, user);
		} else {
			this.consultationService.deleteTicket(ticketId);
		}
		return new ResponseEntity<MessageResponse>(new MessageResponse("Ticket deleted!"), HttpStatus.OK);
	}

}
