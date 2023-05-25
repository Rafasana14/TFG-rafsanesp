package org.springframework.samples.petclinic.visit;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.owner.PricingPlan;
import org.springframework.samples.petclinic.util.UtilFunctions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VisitService {

	private static final Integer BASIC_LIMIT = 1;
	private static final Integer GOLD_LIMIT = 3;
	private static final Integer PLATINUM_LIMIT = 6;

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
	public Collection<Visit> findVisitsByVetId(int vetId) {
		return visitRepository.findByVetId(vetId);
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
		Integer visitCount = this.visitRepository.countVisitsByPetInMonth(visit.getPet().getId(),
				visit.getDatetime().getMonthValue(), visit.getDatetime().getYear());
		PricingPlan plan = visit.getPet().getOwner().getPlan();
		switch (plan) {
		case PLATINUM:
			if (visitCount < PLATINUM_LIMIT)
				return true;
			break;
		case GOLD:
			if (visitCount < GOLD_LIMIT)
				return true;
			break;
		default:
			if (visitCount < BASIC_LIMIT)
				return true;
			break;

		}
		return false;
	}

	public Map<String, Object> getVisitsOwnerStats(int ownerId) {
		Map<String, Object> res = new HashMap<>();
		Integer countAll = this.visitRepository.countAllByOwner(ownerId);
		int pets = this.visitRepository.countAllPetsOfOwner(ownerId);
		if (countAll > 0) {
			Map<String, Integer> visitsByYear = getVisitsByYear(this.visitRepository.countVisitsGroupedByYear(ownerId));
			res.put("visitsByYear", visitsByYear);

			if (pets > 1) {
				Map<String, Integer> visitsByPet = getVisitsByPet(ownerId);
				res.put("visitsByPet", visitsByPet);
			}

			int years = LocalDate.now().getYear() - this.visitRepository.getYearOfFirstVisit(ownerId);
			if (years >= 1) {
				Double avgVisitsPerYear = (double) countAll / (years + 1);
				res.put("avgVisitsPerYear", UtilFunctions.round(2, avgVisitsPerYear));
			}
		}

		res.put("totalVisits", countAll);

		return res;
	}

	public Map<String, Object> getVisitsAdminStats() {
		Map<String, Object> res = new HashMap<>();

		Integer countAll = this.visitRepository.countAll();
		Map<String, Integer> visitsByYear = getVisitsByYear(this.visitRepository.countVisitsGroupedByYear());
		res.put("visitsByYear", visitsByYear);
		int pets = this.visitRepository.countAllPets();
		if (pets > 0) {
			Double avgVisitsPerPet = (double) this.visitRepository.countAll() / pets;
			res.put("avgVisitsPerPet", UtilFunctions.round(2, avgVisitsPerPet));
		}

		res.put("totalVisits", countAll);
		return res;
	}

	private Map<String, Integer> getVisitsByYear(List<Map<String, Integer>> list) {
		Map<String, Integer> unsortedVisitsPerYear = new HashMap<>();
		list.forEach(m -> {
			String key = m.get("year").toString();
			Integer value = m.get("visits");
			unsortedVisitsPerYear.put(key, value);
		});
		return unsortedVisitsPerYear.entrySet().stream().sorted(Map.Entry.comparingByKey(Comparator.reverseOrder()))
				.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (oldValue, newValue) -> oldValue,
						LinkedHashMap::new));
	}

	private Map<String, Integer> getVisitsByPet(int userId) {
		Map<String, Integer> unsortedVisitsByPet = new HashMap<>();
		this.visitRepository.findAllPetsByOwner(userId).forEach(m -> {
			String key = m.getName();
			unsortedVisitsByPet.put(key, 0);
		});
		this.visitRepository.countVisitsGroupedByPet(userId).forEach(m -> {
			String key = m.get("pet");
			Integer value = Integer.parseInt(m.get("visits"));
			unsortedVisitsByPet.put(key, value);
		});
		return unsortedVisitsByPet;
	}



}
