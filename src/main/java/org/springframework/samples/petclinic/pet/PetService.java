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
package org.springframework.samples.petclinic.pet;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.pet.exceptions.DuplicatedPetNameException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * Mostly used as a facade for all Petclinic controllers Also a placeholder
 * for @Transactional and @Cacheable annotations
 *
 * @author Michael Isvy
 */
@Service
public class PetService {

	private PetRepository petRepository;
	
	private VisitRepository visitRepository;
	

	@Autowired
	public PetService(PetRepository petRepository,
			VisitRepository visitRepository) {
		this.petRepository = petRepository;
		this.visitRepository = visitRepository;
	}

	@Transactional(readOnly = true)
	public Collection<PetType> findPetTypes() throws DataAccessException {
		return petRepository.findPetTypes();
	}
	
	@Transactional(readOnly = true)
	public PetType findPetTypeByName(String name) throws DataAccessException {
		return petRepository.findPetTypeByName(name).orElseThrow(()->new ResourceNotFoundException("PetType","name",name));
	}
	
	@Transactional(readOnly = true)
	public Collection<Pet> findAll() {
		return (List<Pet>)petRepository.findAll();
	}
	
	@Transactional(readOnly = true)
	public Pet findPetById(int id) throws DataAccessException {
		Optional<Pet> opt = petRepository.findById(id);
		if(opt.isPresent()) return opt.get();
		else return null;
	}
	
//	@Transactional(readOnly = true)
//	public Owner findOwnerByPetId(int id) throws DataAccessException {
//		return petRepository.findOwnerByPetId(id).orElseThrow(()->new ResourceNotFoundException("Owner","pet",id));
//	}
	
	@Transactional(readOnly = true)
	public List<Pet> findAllPetsByOwnerId(int id) throws DataAccessException {
		return petRepository.findAllPetsByOwnerId(id);
	}

	@Transactional(rollbackFor = DuplicatedPetNameException.class)
	public Pet savePet(Pet pet) throws DataAccessException, DuplicatedPetNameException {
		
			if(pet.getOwner()!=null){
				Pet otherPet=getPetWithNameAndIdDifferent(pet);
            	if (StringUtils.hasLength(pet.getName()) &&  (otherPet!= null && otherPet.getId()!=pet.getId())) {            	
            		throw new DuplicatedPetNameException();
            	}else
                	petRepository.save(pet);                
			}else
				petRepository.save(pet);
			
			return pet;
	}
	
	private Pet getPetWithNameAndIdDifferent(Pet pet) {
		String name = pet.getName().toLowerCase();
		for (Pet p : findAllPetsByOwnerId(pet.getOwner().getId())) {
			String compName = p.getName().toLowerCase();
			if (compName.equals(name) && p.getId()!=pet.getId()) {
				return p;
			}
		}
		return null;
	}
	
	@Transactional
	public Pet updatePet(Pet pet, int id) throws DataAccessException {
		Pet toUpdate = findPetById(id);
		BeanUtils.copyProperties(pet, toUpdate, "id");
		petRepository.save(toUpdate);
		
		return toUpdate;
	}	
	
	@Transactional
	public void deletePet(Pet pet) throws DataAccessException {
		petRepository.deleteVisitsOfPet(pet.getId());
		petRepository.delete(pet);
	}
	
	@Transactional
	public void deletePet(int id) throws DataAccessException {
		Pet toDelete=findPetById(id);
		petRepository.deleteVisitsOfPet(toDelete.getId());
		petRepository.delete(toDelete);
	}
	
// Visit Services
	@Transactional(readOnly = true)
	public Collection<Visit> findVisitsByPetId(int petId) {
		return visitRepository.findByPetId(petId);
	}
	
	@Transactional(readOnly = true)
	public Visit findVisitById(int id) throws DataAccessException {
		Optional<Visit> opt = visitRepository.findById(id);
		if(opt.isPresent()) return opt.get();
		else return null;
	}
	
	@Transactional
	public Visit saveVisit(Visit visit) throws DataAccessException {
		visitRepository.save(visit);
		return visit;
	}
	
	@Transactional
	public Visit updateVisit(Visit visit, int id) throws DataAccessException {
		Visit toUpdate = findVisitById(id);
		System.out.println(visit);
		System.out.println(toUpdate);
		BeanUtils.copyProperties(visit, toUpdate, "id");
		visitRepository.save(toUpdate);
		
		return toUpdate;
	}	
	
	@Transactional
	public void deleteVisitsOfPet(int petId) {
		Pet pet = findPetById(petId);
		petRepository.deleteVisitsOfPet(petId);
		petRepository.save(pet);
	}
	
	@Transactional
	public void deleteVisit(Visit visit) throws DataAccessException {
		visitRepository.delete(visit);
	}
	
	@Transactional
	public void deleteVisit(int id) throws DataAccessException {
		Visit toDelete=findVisitById(id);
		visitRepository.delete(toDelete);
	}
	

}
