/*
 * Copyright 2002-2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springframework.samples.petclinic.owner;

import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OwnerService {

	private OwnerRepository ownerRepository;
//	private UserService userService;

	@Autowired
	public OwnerService(OwnerRepository ownerRepository, UserService petService) {
		this.ownerRepository = ownerRepository;
//		this.userService = userService;
	}

	@Transactional(readOnly = true)
	public Iterable<Owner> findAll() throws DataAccessException {
		return ownerRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Collection<Owner> findOwnerByLastName(String lastName) throws DataAccessException {
		return ownerRepository.findByLastName(lastName);
	}

	@Transactional(readOnly = true)
	public Owner findOwnerById(int id) throws DataAccessException {
		return this.ownerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Owner", "ID", id));
	}

	@Transactional(readOnly = true)
	public Owner findOwnerByUser(int userId) throws DataAccessException {
		return this.ownerRepository.findByUser(userId).orElseThrow(()->new ResourceNotFoundException("Owner","User ID",userId));
	}

	@Transactional(readOnly = true)
	public Optional<Owner> optFindOwnerByUser(int userId) throws DataAccessException {
		return this.ownerRepository.findByUser(userId);
	}

	@Transactional
	public Owner saveOwner(Owner owner) throws DataAccessException {
		ownerRepository.save(owner);
		return owner;
	}

	@Transactional
	public Owner updateOwner(Owner owner, int id) throws DataAccessException {
		Owner toUpdate = findOwnerById(id);
		BeanUtils.copyProperties(owner, toUpdate, "id", "user");
		return saveOwner(toUpdate);
	}

	@Transactional
	public Owner updatePlan(PricingPlan plan, int id) throws DataAccessException {
		Owner toUpdate = findOwnerById(id);
		toUpdate.setPlan(plan);
		ownerRepository.save(toUpdate);

		return toUpdate;
	}

	@Transactional
	public void deleteOwner(int id) throws DataAccessException {
		Owner toDelete = findOwnerById(id);
		ownerRepository.delete(toDelete);
	}

	@Transactional(readOnly = true)
	public Map<String, Object> getOwnersStats() {
		Map<String, Object> res = new HashMap<>();
		Integer totalOwners = this.ownerRepository.countAll();
		Integer moreThanOnePet = getOwnersWithMoreThanOnePet();

		res.put("ownersByPlan", getOwnersPlans());
		res.put("totalOwners", totalOwners);
		res.put("moreThanOnePet", moreThanOnePet);

		return res;

	}

	private Integer getOwnersWithMoreThanOnePet() {
		Integer res = 0;
		List<Owner> owners = (List<Owner>) findAll();
		for (Owner o : owners) {
			if (this.ownerRepository.findPetsByOwner(o.getId()).size() > 1)
				res++;
		}
		return res;
	}
	
	private Map<String, Integer> getOwnersPlans() {
		Map<String, Integer> unsortedOwnersPlans = new HashMap<>();
		unsortedOwnersPlans.put("BASIC", 0);
		unsortedOwnersPlans.put("GOLD", 0);
		unsortedOwnersPlans.put("PLATINUM", 0);
		this.ownerRepository.countOwnersGroupedByPlan().forEach(m -> {
			String key = m.get("plan");
			Integer value = Integer.parseInt(m.get("owners"));
			unsortedOwnersPlans.put(key, value);
		});
		return unsortedOwnersPlans.entrySet().stream().sorted(Map.Entry.comparingByKey(Comparator.naturalOrder()))
				.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (oldValue, newValue) -> oldValue,
						LinkedHashMap::new));
	}

}
