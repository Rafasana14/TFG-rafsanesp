package org.springframework.samples.petclinic.visit;

import java.util.Collection;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VisitService {
	
	private final VisitRepository visitRepository;
	
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
		Optional<Visit> opt = visitRepository.findById(id);
		if (opt.isPresent())
			return opt.get();
		else
			return null;
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
	public void deleteVisit(Visit visit) throws DataAccessException {
		visitRepository.delete(visit);
	}

	@Transactional
	public void deleteVisit(int id) throws DataAccessException {
		Visit toDelete = findVisitById(id);
		visitRepository.delete(toDelete);
	}

}
