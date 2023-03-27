package org.springframework.samples.petclinic.visit;

import java.util.Collection;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.owner.PricingPlan;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VisitService {

	private final Integer BASIC_LIMIT = 1;
	private final Integer GOLD_LIMIT = 3;
	private final Integer PLATINUM_LIMIT = 6;

	private final VisitRepository visitRepository;
	
	@Autowired
	public VisitService(VisitRepository visitRepository) {
		this.visitRepository = visitRepository;
	}

	@Transactional(readOnly = true)
	public Iterable<Visit> findAll() {
		return visitRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Collection<Visit> findVisitsByOwnerId(int ownerId) {
		return visitRepository.findByOwnerId(ownerId);
	}

	@Transactional(readOnly = true)
	public Collection<Visit> findVisitsByPetId(int petId) {
		return visitRepository.findByPetId(petId);
	}

	@Transactional(readOnly = true)
	public Visit findVisitById(int id) throws DataAccessException {
		return visitRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Visit", "ID", id));
	}

	@Transactional
	public Visit saveVisit(Visit visit) throws DataAccessException {
		visitRepository.save(visit);
		return visit;
	}

	@Transactional
	public Visit updateVisit(Visit visit, int id) throws DataAccessException {
		Visit toUpdate = findVisitById(id);
		BeanUtils.copyProperties(visit, toUpdate, "id");
		visitRepository.save(toUpdate);

		return toUpdate;
	}

	@Transactional
	public void deleteVisit(int id) throws DataAccessException {
		Visit toDelete = findVisitById(id);
		visitRepository.delete(toDelete);
	}

	public boolean underLimit(Visit visit) {
		Integer petCount = this.visitRepository.countVisitsOfPetInMonth(visit.getPet().getId(),
				visit.getDatetime().getMonthValue(), visit.getDatetime().getYear());
		PricingPlan plan = visit.getPet().getOwner().getPlan();
		switch (plan) {
		case BASIC:
			if (petCount < BASIC_LIMIT)
				return true;
			break;
		case GOLD:
			if (petCount < GOLD_LIMIT)
				return true;
			break;
		case PLATINUM:
			if (petCount < PLATINUM_LIMIT)
				return true;
			break;
		}
		return false;
	}

}
