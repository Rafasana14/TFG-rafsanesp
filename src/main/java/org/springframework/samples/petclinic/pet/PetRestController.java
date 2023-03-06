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

import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.exceptions.ResourceNotOwnedException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.pet.exceptions.DuplicatedPetNameException;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.util.RestPreconditions;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import petclinic.payload.response.MessageResponse;

@RestController
@RequestMapping("/api/v1/pets")
public class PetRestController {

	private final PetService petService;
	private final OwnerService ownerService;
	private final UserService userService;

	public PetRestController(PetService petService, OwnerService ownerService, UserService userService) {
		this.petService = petService;
		this.ownerService = ownerService;
		this.userService = userService;
	}

	@GetMapping
	public List<Pet> findAll() {
		User user = userService.findCurrentUser();
		if (user.hasAuthority("ADMIN") || user.hasAuthority("VET")) {
			return StreamSupport.stream(petService.findAll().spliterator(), false).collect(Collectors.toList());
		} else {
			Owner owner = ownerService.findOwnerByUser(user.getId());
			return petService.findAllPetsByOwnerId(owner.getId());
		}
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Pet> create(@RequestBody Pet pet)
			throws URISyntaxException, DataAccessException, DuplicatedPetNameException {
		User user = userService.findCurrentUser();
		Pet newPet = new Pet();
		BeanUtils.copyProperties(pet, newPet, "id");
		if (user.hasAuthority("OWNER")) {
			Owner owner = ownerService.findOwnerByUser(user.getId());
			newPet.setOwner(owner);
		} else {
			Owner owner = ownerService.findOwnerById(pet.getId());
			newPet.setOwner(owner);
		}
		Pet savedPet = this.petService.savePet(newPet);

//		return ResponseEntity.created(new URI("/api/v1/pets/" + savedPet.getId())).body(savedPet);
		return new ResponseEntity<Pet>(savedPet, HttpStatus.CREATED);
	}

	@PutMapping("{petId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Pet> update(@PathVariable("petId") int petId, @RequestBody @Valid Pet pet) {
		Pet aux = RestPreconditions.checkNotNull(petService.findPetById(petId), "Pet", "ID", petId);
		User user = userService.findCurrentUser();
		Boolean cond = false;
		if (user.hasAuthority("OWNER")) {
			Owner loggedOwner = ownerService.findOwnerByUser(user.getId());
			Owner petOwner = aux.getOwner();
			if (loggedOwner.getId() == petOwner.getId())
				cond = true;
		}
		if (!user.hasAuthority("OWNER") || cond) {
			return new ResponseEntity<Pet>(this.petService.updatePet(pet, petId), HttpStatus.OK);
		} else
			throw new ResourceNotOwnedException(Pet.class.getName());
	}

	@GetMapping("{petId}")
	public ResponseEntity<Pet> findById(@PathVariable("petId") int petId) {
		Pet pet = RestPreconditions.checkNotNull(petService.findPetById(petId), "Pet", "ID", petId);
		User user = userService.findCurrentUser();
		Boolean cond = false;
		if (user.hasAuthority("OWNER")) {
			Owner loggedOwner = ownerService.findOwnerByUser(user.getId());
			Owner petOwner = pet.getOwner();
			if (loggedOwner.getId() == petOwner.getId())
				cond = true;
		}
		if (!user.hasAuthority("OWNER") || cond) {
			return new ResponseEntity<Pet>(this.petService.findPetById(petId), HttpStatus.OK);
		} else
			throw new ResourceNotOwnedException(Pet.class.getSimpleName());
	}

	@DeleteMapping("{petId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<MessageResponse> delete(@PathVariable("petId") int petId) {
		Pet pet = RestPreconditions.checkNotNull(petService.findPetById(petId), "Pet", "ID", petId);
		User user = userService.findCurrentUser();
		Boolean cond = false;
		if (user.hasAuthority("OWNER")) {
			Owner loggedOwner = ownerService.findOwnerByUser(user.getId());
			Owner petOwner = pet.getOwner();
			if (loggedOwner.getId() == petOwner.getId())
				cond = true;
		}
		if (user.hasAuthority("ADMIN") || cond) {
			petService.deletePet(petId);
			return new ResponseEntity<MessageResponse>(new MessageResponse("Pet deleted!"), HttpStatus.OK);
		} else {
			throw new ResourceNotOwnedException(Pet.class.getName());
		}
	}

	@GetMapping("types")
	public List<PetType> findAllTypes() {
		return StreamSupport.stream(petService.findPetTypes().spliterator(), false).collect(Collectors.toList());
	}

	//Cambiar por QueryParam ownerId
	
//	@GetMapping("/api/v1/owners/{ownerId}/pets")
//	public List<Pet> findAllPetsOfOwner(@PathVariable("ownerId") int ownerId) {
//		User user = userService.findCurrentUser();
//		if (user.hasAuthority("ADMIN") || user.hasAuthority("VET")) {
//			return petService.findAllPetsByOwnerId(ownerId);
//		} else {
//			Owner owner = ownerService.findOwnerByUser(user.getId());
//			return petService.findAllPetsByOwnerId(owner.getId());
//		}
//	}
//
//	@PostMapping("/api/v1/owners/{ownerId}/pets")
//	@ResponseStatus(HttpStatus.CREATED)
//	public ResponseEntity<?> create(@RequestBody @Valid Pet pet, @PathVariable("ownerId") int ownerId)
//			throws URISyntaxException, DataAccessException, DuplicatedPetNameException {
//		User user = userService.findCurrentUser();
//		Owner owner;
//		Pet savedPet;
//		if (user.hasAuthority("ADMIN")) {
//			owner = ownerService.findOwnerById(ownerId);
//			Pet newPet = new Pet();
//			BeanUtils.copyProperties(pet, newPet, "id");
//			newPet.setOwner(owner);
//			savedPet = this.petService.savePet(newPet);
//		} else {
//			owner = ownerService.findOwnerByUser(user.getId());
//			Pet newPet = new Pet();
//			BeanUtils.copyProperties(pet, newPet, "id");
//			newPet.setOwner(owner);
//			savedPet = this.petService.savePet(newPet);
//		}
//		return ResponseEntity.created(new URI("/api/v1/owners/" + owner.getId() + "/pets/" + savedPet.getId()))
//				.body(savedPet);
////		 return new ResponseEntity<Pet>(savedPet,HttpStatus.CREATED);
//	}
//
//	@PutMapping(value = "/api/v1/owners/{ownerId}/pets/{petId}")
//	@ResponseStatus(HttpStatus.OK)
//	public ResponseEntity<?> update(@PathVariable("petId") int petId, @PathVariable("ownerId") int ownerId,
//			@RequestBody @Valid Pet pet) {
//		User user = userService.findCurrentUser();
//		if (user.getAuthority().getAuthority().equals("ADMIN")) {
//			return new ResponseEntity<Pet>(this.petService.updatePet(pet, petId), HttpStatus.OK);
//		} else
//			throw new ResourceNotOwnedException(pet.getClass().getName());
//
//	}
//
//	@DeleteMapping(value = "/api/v1/owners/{ownerId}/pets/{petId}")
//	@ResponseStatus(HttpStatus.OK)
//	public ResponseEntity<MessageResponse> delete(@PathVariable("petId") int id, @PathVariable("ownerId") int ownerId) {
//		Pet pet = RestPreconditions.checkNotNull(petService.findPetById(id), "Pet", "ID", id);
//		User user = userService.findCurrentUser();
//		if (user.hasAuthority("ADMIN") || ownerService.findOwnerByUser(user.getId()).getId() == ownerId) {
//			petService.deletePet(id);
//			return new ResponseEntity<MessageResponse>(new MessageResponse("Pet deleted!"), HttpStatus.BAD_REQUEST);
//		} else
//			throw new ResourceNotOwnedException(pet.getClass().getName());
//	}

}
