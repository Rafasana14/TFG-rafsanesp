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

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Mostly used as a facade for all Petclinic controllers Also a placeholder
 * for @Transactional and @Cacheable annotations
 *
 * @author Michael Isvy
 */
@Service
public class OwnerService {

	private OwnerRepository ownerRepository;	
	
//	private UserService userService;
//	
////	@Autowired
////	private PetRepository petRepository;
//	
//	private AuthoritiesService authoritiesService;

	@Autowired
	public OwnerService(OwnerRepository ownerRepository) {
		this.ownerRepository = ownerRepository;
//		this.userService = userService;
//		this.authoritiesService = authoritiesService;
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
		return this.ownerRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Owner","ID",id));
	}

	@Transactional
	public Owner saveOwner(Owner owner) throws DataAccessException {
		//creating owner
		ownerRepository.save(owner);		
		//creating user
		//userService.saveUser(owner.getUser());
		//creating authorities
		//authoritiesService.saveAuthorities(owner.getUser().getUsername(), "OWNER");
		
		return owner;
	}
	
	@Transactional
	public Owner updateOwner(Owner owner, int id) throws DataAccessException {
		Owner toUpdate = findOwnerById(id);
		BeanUtils.copyProperties(owner, toUpdate, "id","user");
		ownerRepository.save(toUpdate);
		
		return toUpdate;
	}	
	
	@Transactional
	public void deleteOwner(Owner owner) throws DataAccessException {
		ownerRepository.deletePetsOfOwner(owner.getId());
		ownerRepository.delete(owner);
	}
	
	@Transactional
	public void deleteOwner(int id) throws DataAccessException {
		Owner toDelete=findOwnerById(id);
//		List<Pet> petsToDelete = this.ownerRepository.findPetsOfOwner(id);
//		petRepository.deleteAll(petsToDelete);
		ownerRepository.deletePetsOfOwner(id);
		ownerRepository.delete(toDelete);
	}

}
