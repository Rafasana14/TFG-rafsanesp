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

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import petclinic.payload.response.MessageResponse;

/**
 * @author Juergen Hoeller
 * @author Ken Krebs
 * @author Arjen Poutsma
 */
@RestController
//@RequestMapping("/api/v1/owners/{ownerId}/pets")
public class PetRestController {

	private final PetService petService;
	private final OwnerService ownerService;
	private final UserService userService;

	@Autowired
	public PetRestController(PetService petService, OwnerService ownerService, UserService userService) {
		this.petService = petService;
		this.ownerService = ownerService;
		this.userService = userService;
	}

	@GetMapping("/api/v1/pets")
	public List<Pet> findAll() {
		User user = userService.findCurrentUser();
		if (user.hasAuthority("ADMIN") || user.hasAuthority("VET")) {
			return StreamSupport.stream(petService.findAll().spliterator(), false).collect(Collectors.toList());
		} else {
			Owner owner = ownerService.findOwnerByUser(user.getId());
			return petService.findAllPetsByOwnerId(owner.getId());
		}
	}

	@PostMapping("/api/v1/pets")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> create(@RequestBody @Valid Pet pet)
			throws URISyntaxException, DataAccessException, DuplicatedPetNameException {
		try {
			User user = userService.findCurrentUser();
			Pet newPet = new Pet();
			BeanUtils.copyProperties(pet, newPet, "id");
			if (user.hasAuthority("OWNER")) {
				Owner owner = ownerService.findOwnerByUser(user.getId());
				newPet.setOwner(owner);
			}
			Pet savedPet = this.petService.savePet(newPet);

			return ResponseEntity.created(new URI("/api/v1/pets/" + savedPet.getId())).body(savedPet);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
//		 return new ResponseEntity<Pet>(savedPet,HttpStatus.CREATED);
	}

	@PutMapping(value = "/api/v1/pets/{petId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> update(@PathVariable("petId") int petId, @RequestBody @Valid Pet pet) {
		try {
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
		} catch (Exception e) {
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping(value = "/api/v1/pets/{petId}")
	public ResponseEntity<?> findById(@PathVariable("petId") int petId) {
		try {
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
		} catch (Exception e) {
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
	}

	@DeleteMapping(value = "/api/v1/pets/{petId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<MessageResponse> delete(@PathVariable("petId") int petId) {
		try {
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
		} catch (ResourceNotOwnedException | DataAccessException e) {
			e.getStackTrace();
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		} 
	}

	@GetMapping("/api/v1/pets/types")
	public List<PetType> findAllTypes() {
		return StreamSupport.stream(petService.findPetTypes().spliterator(), false).collect(Collectors.toList());
	}

	@GetMapping("/api/v1/owners/{ownerId}/pets")
	public List<Pet> findAllPetsOfOwner(@PathVariable("ownerId") int ownerId) {
		User user = userService.findCurrentUser();
		if (user.hasAuthority("ADMIN") || user.hasAuthority("VET")) {
			return petService.findAllPetsByOwnerId(ownerId);
		} else {
			Owner owner = ownerService.findOwnerByUser(user.getId());
			return petService.findAllPetsByOwnerId(owner.getId());
		}
	}

	@PostMapping("/api/v1/owners/{ownerId}/pets")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> create(@RequestBody @Valid Pet pet, @PathVariable("ownerId") int ownerId)
			throws URISyntaxException, DataAccessException, DuplicatedPetNameException {
		try {
			User user = userService.findCurrentUser();
			Owner owner;
			Pet savedPet;
			if (user.hasAuthority("ADMIN") || user.hasAuthority("VET")) {
				owner = ownerService.findOwnerById(ownerId);
				Pet newPet = new Pet();
				BeanUtils.copyProperties(pet, newPet, "id");
				newPet.setOwner(owner);
				savedPet = this.petService.savePet(newPet);
			} else {
				owner = ownerService.findOwnerByUser(user.getId());
				Pet newPet = new Pet();
				BeanUtils.copyProperties(pet, newPet, "id");
				newPet.setOwner(owner);
				savedPet = this.petService.savePet(newPet);
			}
			return ResponseEntity.created(new URI("/api/v1/owners/" + owner.getId() + "/pets/" + savedPet.getId()))
					.body(savedPet);
		} catch (Exception e) {
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
//		 return new ResponseEntity<Pet>(savedPet,HttpStatus.CREATED);
	}

//	@PutMapping(value = "/api/v1/owners/{ownerId}/pets/{petId}")
//	@ResponseStatus(HttpStatus.OK)
//	public ResponseEntity<?> update(@PathVariable("petId") int petId, @PathVariable("ownerId") int ownerId,
//			@RequestBody @Valid Pet pet) {
//		try {
//			User user = userService.findCurrentUser();
//			if (user.getAuthority().getAuthority().equals("ADMIN")
//					|| ownerService.findOwnerByUser(user.getId()).getId() == ownerId) {
//				return new ResponseEntity<Pet>(this.petService.updatePet(pet, petId), HttpStatus.OK);
//			} else
//				throw new ResourceNotOwnedException(pet.getClass().getName());
//		} catch (Exception e) {
//			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
//		}
//	}

	@DeleteMapping(value = "/api/v1/owners/{ownerId}/pets/{petId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<MessageResponse> delete(@PathVariable("petId") int id, @PathVariable("ownerId") int ownerId) {
		Pet pet;
		try {
			pet = RestPreconditions.checkNotNull(petService.findPetById(id), "Pet", "ID", id);
			User user = userService.findCurrentUser();
			if (user.hasAuthority("ADMIN") || ownerService.findOwnerByUser(user.getId()).getId() == ownerId) {
				petService.deletePet(id);
				return new ResponseEntity<MessageResponse>(new MessageResponse("Pet deleted!"), HttpStatus.BAD_REQUEST);
			} else
				throw new ResourceNotOwnedException(pet.getClass().getName());
		} catch (Exception e) {
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
	}

}
