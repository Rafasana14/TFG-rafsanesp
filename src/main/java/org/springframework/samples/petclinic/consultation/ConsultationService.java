package org.springframework.samples.petclinic.consultation;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.exceptions.AccessDeniedException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.exceptions.ResourceNotOwnedException;
import org.springframework.samples.petclinic.exceptions.UpperPlanFeatureException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.PricingPlan;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.util.TicketStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConsultationService {

	private TicketRepository ticketRepository;
	private ConsultationRepository consultationRepository;

	@Autowired
	public ConsultationService(TicketRepository ticketRepository, ConsultationRepository consultationRepository) {
		this.ticketRepository = ticketRepository;
		this.consultationRepository = consultationRepository;
	}

	@Transactional(readOnly = true)
	public Iterable<Consultation> findAll() throws DataAccessException {
		return consultationRepository.findAllByOrderByCreationDateDesc();
	}

	@Transactional(readOnly = true)
	public Iterable<Consultation> findAllConsultationsByOwner(int ownerId) throws DataAccessException {
		return consultationRepository.findConsultationsByOwner(ownerId);
	}

//	@Transactional(readOnly = true)
//	public Iterable<Consultation> findAllConsultationsByUser(int userId) throws DataAccessException {
//		return consultationRepository.findConsultationsByUser(userId);
//	}

	@Transactional(readOnly = true)
	public Consultation findConsultationById(int id) throws DataAccessException {
		return this.consultationRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Consultation", "ID", id));
	}

	@Transactional
	public Consultation saveConsultation(Consultation consultation) throws DataAccessException {
		consultationRepository.save(consultation);
		return consultation;
	}

	@Transactional
	public Consultation updateConsultation(Consultation consultation, int id) throws DataAccessException {
		Consultation toUpdate = findConsultationById(id);
		BeanUtils.copyProperties(consultation, toUpdate, "id", "creationDate");
		return saveConsultation(toUpdate);
	}

	@Transactional
	public void deleteConsultation(int id) throws DataAccessException {
		Consultation toDelete = findConsultationById(id);
		for (Ticket ticket : findAllTicketsByConsultation(id))
			deleteTicket(ticket.getId());
		this.consultationRepository.delete(toDelete);
	}

	@Transactional(readOnly = true)
	public Iterable<Ticket> findAllTicketsByConsultation(int consultationId) throws DataAccessException {
		return ticketRepository.findTicketsByConsultation(consultationId);
	}

	@Transactional(readOnly = true)
	public Ticket findTicketById(int id) throws DataAccessException {
		return this.ticketRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ticket", "ID", id));
	}

	@Transactional
	public Ticket saveTicket(Ticket ticket) throws DataAccessException {
		this.ticketRepository.save(ticket);
		return ticket;
	}

	@Transactional
	public Ticket updateTicket(Ticket ticket, int id) throws DataAccessException {
		Ticket toUpdate = findTicketById(id);
		BeanUtils.copyProperties(ticket, toUpdate, "id", "creationDate", "consultation", "user");
		return saveTicket(toUpdate);
	}

	@Transactional
	public void deleteTicket(int id) throws DataAccessException {
		Ticket toDelete = findTicketById(id);
		this.ticketRepository.delete(toDelete);
		updateConsultationStatus(toDelete.getConsultation());
	}

	@Transactional(readOnly = true)
	public void checkLastTicketAndStatus(Consultation consultation, Ticket ticket) {
		List<Ticket> tickets = (List<Ticket>) findAllTicketsByConsultation(consultation.getId());
		if (!tickets.get(tickets.size() - 1).getId().equals(ticket.getId()))
			throw new AccessDeniedException("You can only update or delete the last ticket in a consultation!");
		if (consultation.getStatus().equals(TicketStatus.CLOSED))
			throw new AccessDeniedException("This consultation is closed!");
	}

	@Transactional
	public ResponseEntity<Ticket> updateOwnerTicket(@Valid Ticket ticket, Ticket target, Consultation consultation,
			User currentUser, Owner owner) {
		if (owner.getPlan().equals(PricingPlan.PLATINUM)) {
			if (owner.getId().equals(consultation.getOwner().getId())) {
				if (target.getUser().getId().equals(currentUser.getId())) {
					return new ResponseEntity<>(updateTicket(ticket, target.getId()), HttpStatus.OK);
				} else
					throw new ResourceNotOwnedException(target);
			} else
				throw new ResourceNotOwnedException(consultation);
		} else
			throw new UpperPlanFeatureException(PricingPlan.PLATINUM, owner.getPlan());
	}

	@Transactional
	public ResponseEntity<Ticket> updateVetTicket(@Valid Ticket ticket, Ticket target, Consultation consultation,
			User user) {
		if (target.getUser().getId().equals(user.getId())) {
			return new ResponseEntity<>(updateTicket(ticket, target.getId()), HttpStatus.OK);
		} else
			throw new ResourceNotOwnedException(target);
	}

	@Transactional
	public void deleteOwnerTicket(Ticket ticket, Consultation consultation, User user, Owner owner) {
		if (owner.getPlan().equals(PricingPlan.PLATINUM)) {
			if (owner.getId().equals(consultation.getOwner().getId())) {
				if (ticket.getUser().getId().equals(user.getId())) {
					deleteTicket(ticket.getId());
					updateConsultationStatus(consultation);
				} else
					throw new ResourceNotOwnedException(ticket);
			} else
				throw new ResourceNotOwnedException(consultation);
		} else
			throw new UpperPlanFeatureException(PricingPlan.PLATINUM, owner.getPlan());
	}

	@Transactional
	public void deleteVetTicket(Ticket ticket, Consultation consultation, User user) {
		if (ticket.getUser().getId().equals(user.getId())) {
			deleteTicket(ticket.getId());
			updateConsultationStatus(consultation);
		} else
			throw new ResourceNotOwnedException(ticket);
	}

	private void updateConsultationStatus(Consultation consultation) {
		List<Ticket> tickets = (List<Ticket>) findAllTicketsByConsultation(consultation.getId());
		if (tickets.size() != 0) {
			if (tickets.get(tickets.size() - 1).getUser().getAuthority().getAuthority().equals("OWNER"))
				consultation.setStatus(TicketStatus.PENDING);
			else
				consultation.setStatus(TicketStatus.ANSWERED);
			saveConsultation(consultation);
		} else
			consultation.setStatus(TicketStatus.PENDING);
	}

	public void checkIfTicketInConsultation(Consultation consultation, Ticket ticket) {
		List<Ticket> tickets = this.ticketRepository.findTicketsByConsultation(consultation.getId());
		if (!tickets.contains(ticket))
			throw new AccessDeniedException("The ticket " + ticket.getId() + " doesn't belong to the consultation "
					+ consultation.getId() + ".");
	}
}
