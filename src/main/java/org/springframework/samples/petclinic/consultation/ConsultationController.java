package org.springframework.samples.petclinic.consultation;

import java.util.List;
import java.util.Map;

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
	private static final String OWNER_AUTH = "OWNER";
	private static final String ADMIN_AUTH = "ADMIN";

	@Autowired
	public ConsultationController(ConsultationService consultationService, UserService userService) {
		this.consultationService = consultationService;
		this.userService = userService;
	}

	@GetMapping
	public ResponseEntity<List<Consultation>> findAllConsultations() {
		User user = userService.findCurrentUser();
		List<Consultation> res;
		if (user.hasAnyAuthority("VET", ADMIN_AUTH).equals(true)) {
			res = (List<Consultation>) consultationService.findAll();
		} else {
			Owner owner = userService.findOwnerByUser(user.getId());
			res = (List<Consultation>) consultationService.findAllConsultationsByOwner(owner.getId());
		}
		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	@GetMapping(value = "{consultationId}")
	public ResponseEntity<Consultation> findConsultationById(@PathVariable("consultationId") int id) {
		User user = userService.findCurrentUser();
		Consultation cons = this.consultationService.findConsultationById(id);
		if (user.hasAnyAuthority(ADMIN_AUTH, "VET").equals(true))
			return new ResponseEntity<>(cons, HttpStatus.OK);
		else {
			Owner owner = userService.findOwnerByUser(user.getId());
			if (cons.getPet().getOwner().getId().equals(owner.getId()))
				return new ResponseEntity<>(cons, HttpStatus.OK);
			else
				throw new ResourceNotOwnedException(cons);
		}
	}

	@PostMapping()
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Consultation> createConsultation(@RequestBody @Valid Consultation consultation) {
		User user = userService.findCurrentUser();
		Consultation newConsultation = new Consultation();
		Consultation savedConsultation;
		BeanUtils.copyProperties(consultation, newConsultation, "id");
		if (user.hasAuthority(OWNER_AUTH).equals(true)) {
			Owner owner = userService.findOwnerByUser(user.getId());
			if (owner.getId().equals(consultation.getPet().getOwner().getId())) {
				if (owner.getPlan().equals(PricingPlan.PLATINUM)) {
					newConsultation.setStatus(ConsultationStatus.PENDING);
					savedConsultation = this.consultationService.saveConsultation(newConsultation);
				} else {
					throw new UpperPlanFeatureException(PricingPlan.PLATINUM, owner.getPlan());
				}
			} else {
				throw new ResourceNotOwnedException(consultation.getPet());
			}
		} else {
			savedConsultation = this.consultationService.saveConsultation(newConsultation);
		}
		return new ResponseEntity<>(savedConsultation, HttpStatus.CREATED);
	}

	@PutMapping(value = "{consultationId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Consultation> updateConsultation(@PathVariable("consultationId") int consultationId,
			@RequestBody @Valid Consultation consultation) {
		Consultation aux = consultationService.findConsultationById(consultationId);
		User user = userService.findCurrentUser();
		if (user.hasAuthority(OWNER_AUTH).equals(true)) {
			Owner owner = userService.findOwnerByUser(user.getId());
			if (owner.getId().equals(aux.getPet().getOwner().getId())) {
				if (owner.getPlan().equals(PricingPlan.PLATINUM)) {
					return new ResponseEntity<>(
							this.consultationService.updateConsultation(consultation, consultationId), HttpStatus.OK);
				} else {
					throw new UpperPlanFeatureException(PricingPlan.PLATINUM, owner.getPlan());
				}
			} else {
				throw new ResourceNotOwnedException(aux);
			}
		} else {
			return new ResponseEntity<>(this.consultationService.updateConsultation(consultation, consultationId),
					HttpStatus.OK);
		}
	}

	@DeleteMapping(value = "{consultationId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<MessageResponse> deleteConsultation(@PathVariable("consultationId") int id) {
		consultationService.deleteConsultation(id);
		return new ResponseEntity<>(new MessageResponse("Consultation deleted!"), HttpStatus.OK);
	}

	@GetMapping(value = "stats")
	public ResponseEntity<Map<String, Object>> getStats() {
		User user = this.userService.findCurrentUser();
		if (user.hasAuthority(OWNER_AUTH).equals(true)) {
			Owner o = userService.findOwnerByUser(user.getId());
			if (o.getPlan().equals(PricingPlan.PLATINUM))
				return new ResponseEntity<>(consultationService.getOwnerConsultationsStats(o.getId()), HttpStatus.OK);
			else throw new UpperPlanFeatureException(PricingPlan.PLATINUM, o.getPlan());
		} else if (user.hasAuthority(ADMIN_AUTH).equals(true))
			return new ResponseEntity<>(consultationService.getAdminConsultationsStats(), HttpStatus.OK);
		throw new AccessDeniedException();
	}

	@GetMapping(value = "{consultationId}/tickets")
	public ResponseEntity<List<Ticket>> findAllTicketsByConsultation(@PathVariable("consultationId") int id) {
		Consultation cons = consultationService.findConsultationById(id);
		User user = userService.findCurrentUser();
		List<Ticket> res;
		if (user.hasAuthority(OWNER_AUTH).equals(true)) {
			Owner owner = userService.findOwnerByUser(user.getId());
			if (cons.getPet().getOwner().getId().equals(owner.getId()))
				res = (List<Ticket>) consultationService.findAllTicketsByConsultation(id);
			else
				throw new ResourceNotOwnedException(cons);
		} else {
			res = (List<Ticket>) consultationService.findAllTicketsByConsultation(id);
		}
		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	@GetMapping(value = "{consultationId}/tickets/{ticketId}")
	public ResponseEntity<Ticket> findTicketById(@PathVariable("consultationId") int consultationId,
			@PathVariable("ticketId") int ticketId) {
		Consultation cons = consultationService.findConsultationById(consultationId);
		User user = userService.findCurrentUser();
		Ticket ticket = this.consultationService.findTicketById(ticketId);
		this.consultationService.checkIfTicketInConsultation(cons, ticket);
		if (user.hasAuthority(OWNER_AUTH).equals(true)) {
			Owner owner = userService.findOwnerByUser(user.getId());
			if (cons.getPet().getOwner().getId().equals(owner.getId()))
				return new ResponseEntity<>(ticket, HttpStatus.OK);
			else
				throw new ResourceNotOwnedException(cons);
		} else {
			return new ResponseEntity<>(ticket, HttpStatus.OK);
		}
	}

	@PostMapping(value = "{consultationId}/tickets")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Ticket> createTicket(@PathVariable("consultationId") int consultationId,
			@RequestBody @Valid Ticket ticket) {
		User user = userService.findCurrentUser();
		Consultation cons = consultationService.findConsultationById(consultationId);
		Ticket newTicket = new Ticket();
		BeanUtils.copyProperties(ticket, newTicket, "id");
		newTicket.setUser(user);
		newTicket.setConsultation(cons);
		if (user.hasAuthority(OWNER_AUTH).equals(true)) {
			Owner owner = userService.findOwnerByUser(user.getId());
			if (owner.getId().equals(cons.getPet().getOwner().getId())) {
				if (owner.getPlan().equals(PricingPlan.PLATINUM)) {
					cons.setStatus(ConsultationStatus.PENDING);
					this.consultationService.saveConsultation(cons);
					this.consultationService.saveTicket(newTicket);

				} else
					throw new UpperPlanFeatureException(PricingPlan.PLATINUM, owner.getPlan());
			} else
				throw new ResourceNotOwnedException(cons);
		} else {
			cons.setStatus(ConsultationStatus.ANSWERED);
			this.consultationService.saveConsultation(cons);
			this.consultationService.saveTicket(newTicket);
		}
		return new ResponseEntity<>(newTicket, HttpStatus.CREATED);
	}

	@PutMapping(value = "{consultationId}/tickets/{ticketId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Ticket> updateTicket(@PathVariable("consultationId") int consultationId,
			@PathVariable("ticketId") int ticketId, @RequestBody @Valid Ticket ticket) {
		Consultation consultation = consultationService.findConsultationById(consultationId);
		Ticket aux = consultationService.findTicketById(ticketId);
		this.consultationService.checkIfTicketInConsultation(consultation, aux);
		User user = userService.findCurrentUser();
		if (user.hasAuthority(ADMIN_AUTH).equals(true)) {
			return new ResponseEntity<>(this.consultationService.updateTicket(ticket, ticketId), HttpStatus.OK);
		} else {
			this.consultationService.checkLastTicketAndStatus(consultation, aux);
			if (aux.getUser().getId().equals(user.getId())) {
				if (user.hasAuthority(OWNER_AUTH).equals(true)) {
					Owner owner = userService.findOwnerByUser(user.getId());
					return new ResponseEntity<>(this.consultationService.updateOwnerTicket(ticket, ticketId, owner),
							HttpStatus.OK);
				} else
					return new ResponseEntity<>(this.consultationService.updateTicket(ticket, ticketId), HttpStatus.OK);
			} else
				throw new ResourceNotOwnedException(ticket);
		}
	}

	@DeleteMapping(value = "{consultationId}/tickets/{ticketId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<MessageResponse> deleteTicket(@PathVariable("consultationId") int consultationId,
			@PathVariable("ticketId") int ticketId) {
		Consultation consultation = consultationService.findConsultationById(consultationId);
		Ticket ticket = this.consultationService.findTicketById(ticketId);
		this.consultationService.checkIfTicketInConsultation(consultation, ticket);
		User user = userService.findCurrentUser();
		if (user.hasAuthority(ADMIN_AUTH).equals(true)) {
			this.consultationService.deleteAdminTicket(ticket, consultation);
		} else {
			this.consultationService.checkLastTicketAndStatus(consultation, ticket);
			if (ticket.getUser().getId().equals(user.getId())) {
				if (user.hasAuthority(OWNER_AUTH).equals(true)) {
					Owner owner = userService.findOwnerByUser(user.getUsername());
					this.consultationService.deleteOwnerTicket(ticket, owner);
				} else
					this.consultationService.deleteTicket(ticketId);
			} else
				throw new ResourceNotOwnedException(ticket);
		}
		return new ResponseEntity<>(new MessageResponse("Ticket deleted!"), HttpStatus.OK);
	}

}
