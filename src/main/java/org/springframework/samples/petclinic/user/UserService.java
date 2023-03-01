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
package org.springframework.samples.petclinic.user;

import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.samples.petclinic.vet.VetService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Mostly used as a facade for all Petclinic controllers Also a placeholder
 * for @Transactional and @Cacheable annotations
 *
 * @author Michael Isvy
 */
@Service
public class UserService {

	private UserRepository userRepository;

	private OwnerService ownerService;

	private VetService vetService;

	@Autowired
	public UserService(UserRepository userRepository, OwnerService ownerService, VetService vetService) {
		this.userRepository = userRepository;
		this.ownerService = ownerService;
		this.vetService = vetService;
	}

	@Transactional
	public void saveUser(User user) throws DataAccessException {
		userRepository.save(user);
	}

	@Transactional(readOnly = true)
	public User findUser(String username) {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
	}

	@Transactional(readOnly = true)
	public User findUser(Integer id) {
		return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
	}

	@Transactional(readOnly = true)
	public User findCurrentUser() {
		return userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName())
				.orElseThrow(() -> new ResourceNotFoundException("User", "Logged In", true));
	}

	public Boolean existsUser(String username) {
		return userRepository.existsByUsername(username);
	}

	@Transactional(readOnly = true)
	public Iterable<User> findAll() {
		return userRepository.findAll();
	}

	@Transactional
	public User updateUser(@Valid User user, Integer idToUpdate) {
		User toUpdate = findUser(idToUpdate);
		BeanUtils.copyProperties(user, toUpdate, "id");
		userRepository.save(toUpdate);

		return toUpdate;
	}

	@Transactional(readOnly = true)
	public Owner findOwnerByUser(String username) throws DataAccessException {
		return this.userRepository.findOwnerByUser(username)
				.orElseThrow(() -> new ResourceNotFoundException("Owner", "User", username));
	}

//	@Transactional
//	public void deleteUser(String username) {
//		try {
//			deleteRelations(username);		
//		}catch(ResourceNotFoundException e) {
//			System.out.println("Owner already deleted. Deleting user.");
//		}
//		User toDelete = findUser(username);
//		userRepository.delete(toDelete);
//	}

	@Transactional
	public void deleteUser(Integer id){
		User toDelete = findUser(id);
		deleteRelations(id, toDelete.getAuthority().getAuthority());
		userRepository.delete(toDelete);
	}

	private void deleteRelations(Integer id, String auth) {
		switch (auth) {
		case "OWNER":
			Optional<Owner> owner = ownerService.optFindOwnerByUser(id);
			if(owner.isPresent()) ownerService.deleteOwner(owner.get().getId());
			break;
		case "VET":
			Optional<Vet> vet = vetService.optFindVetByUser(id);
			if(vet.isPresent()) vetService.deleteVet(vet.get().getId());
			break;
		}

	}

}
