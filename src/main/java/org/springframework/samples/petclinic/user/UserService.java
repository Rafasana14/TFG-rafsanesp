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
import org.springframework.samples.petclinic.exceptions.UniqueException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.samples.petclinic.vet.VetService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
	
	private static final String USERNAME_FIELD = "username";

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
	public User saveUser(User user) throws DataAccessException {
		if (checkUniqueUsername(user).equals(true)) {
			userRepository.save(user);
			return user;
		} else {
			throw new UniqueException("Username");
		}
	}

	@Transactional(readOnly = true)
	public User findUser(String username) {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new ResourceNotFoundException("User", USERNAME_FIELD, username));
	}

	@Transactional(readOnly = true)
	public Optional<User> optFindUser(String username) {
		return userRepository.findByUsername(username);
	}

	@Transactional(readOnly = true)
	public User findUser(Integer id) {
		return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
	}

	@Transactional(readOnly = true)
	public Owner findOwnerByUser(String username) {
		return userRepository.findOwnerByUser(username)
				.orElseThrow(() -> new ResourceNotFoundException("Owner", USERNAME_FIELD, username));
	}

	@Transactional(readOnly = true)
	public Owner findOwnerByUser(int id) {
		return userRepository.findOwnerByUser(id).orElseThrow(() -> new ResourceNotFoundException("Owner", "ID", id));
	}

	@Transactional(readOnly = true)
	public Vet findVetByUser(Integer id) {
		return userRepository.findVetByUser(id).orElseThrow(() -> new ResourceNotFoundException("Vet", "ID", id));
	}

	@Transactional(readOnly = true)
	public User findCurrentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null)
			throw new ResourceNotFoundException("Nobody authenticated!");
		else
			return userRepository.findByUsername(auth.getName())
					.orElseThrow(() -> new ResourceNotFoundException("User", USERNAME_FIELD, auth.getName()));
	}

	public Boolean existsUser(String username) {
		return userRepository.existsByUsername(username);
	}

	@Transactional(readOnly = true)
	public Iterable<User> findAll() {
		return userRepository.findAll();
	}

	public Iterable<User> findAllByAuthority(String auth) {
		return userRepository.findAllByAuthority(auth);
	}

	private Boolean checkUniqueUsername(User user) {
		Optional<User> aux = optFindUser(user.getUsername());
		return (aux.isEmpty() || aux.get().getId().equals(user.getId()));
	}

	@Transactional
	public User updateUser(@Valid User user, Integer idToUpdate) {
		if (checkUniqueUsername(user).equals(true)) {
			User toUpdate = findUser(idToUpdate);
			BeanUtils.copyProperties(user, toUpdate, "id");
			this.userRepository.save(toUpdate);
			return toUpdate;
		} else
			throw new UniqueException("Username");
	}

	@Transactional
	public void deleteUser(Integer id) {
		User toDelete = findUser(id);
		deleteRelations(id, toDelete.getAuthority().getAuthority());
		this.userRepository.delete(toDelete);
	}

	private void deleteRelations(Integer id, String auth) {
		switch (auth) {
		case "OWNER":
			Owner owner = this.ownerService.findOwnerByUser(id);
			this.ownerService.deleteOwner(owner.getId());
			break;
		case "VET":
			Vet vet = this.vetService.findVetByUser(id);
			this.vetService.deleteVet(vet.getId());
			break;
		default:
			// The only relations that have user are Owner and Vet
			break;
		}

	}

}
