package org.springframework.samples.petclinic.consultation;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.AccessDeniedException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.exceptions.UpperPlanFeatureException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.PricingPlan;
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
		BeanUtils.copyProperties(consultation, toUpdate, "id", "creationDate", "owner", "pet");
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
	public Ticket updateOwnerTicket(Ticket ticket, Integer targetId, Owner owner) {
		if (owner.getPlan().equals(PricingPlan.PLATINUM)) {
			return updateTicket(ticket, targetId);
		} else
			throw new UpperPlanFeatureException(PricingPlan.PLATINUM, owner.getPlan());
	}

	@Transactional
	public void deleteOwnerTicket(Ticket ticket, Owner owner) {
		if (owner.getPlan().equals(PricingPlan.PLATINUM)) {
			deleteTicket(ticket.getId());
		} else
			throw new UpperPlanFeatureException(PricingPlan.PLATINUM, owner.getPlan());
	}

	@Transactional
	public void deleteAdminTicket(Ticket ticket, Consultation consultation) {
		List<Ticket> tickets = (List<Ticket>) findAllTicketsByConsultation(consultation.getId());
		for (Ticket t : tickets) {
			if (t.getCreationDate().isAfter(ticket.getCreationDate()))
				this.ticketRepository.delete(t);
		}
		this.ticketRepository.delete(ticket);
		updateConsultationStatus(consultation);

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
