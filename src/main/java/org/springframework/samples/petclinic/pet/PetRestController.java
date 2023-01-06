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
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.pet.exceptions.DuplicatedPetNameException;
import org.springframework.samples.petclinic.util.RestPreconditions;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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

	@Autowired
	public PetRestController(PetService petService, OwnerService ownerService) {
		this.petService = petService;
		this.ownerService = ownerService;
	}

//	@ModelAttribute("types")
//	public Collection<PetType> populatePetTypes() {
//		return this.petService.findPetTypes();
//	}
//
//	@ModelAttribute("owner")
//	public Owner findOwner(@PathVariable("ownerId") int ownerId) {
//		return this.ownerService.findOwnerById(ownerId);
//	}

	@InitBinder("owner")
	public void initOwnerBinder(WebDataBinder dataBinder) {
		dataBinder.setDisallowedFields("id");
	}

	@InitBinder("pet")
	public void initPetBinder(WebDataBinder dataBinder) {
		dataBinder.setValidator(new PetValidator());
	}

	@PostMapping(value = "/pets/new")
	@ResponseStatus(HttpStatus.CREATED)
	public void create(@PathVariable("ownerId") int ownerId, @RequestBody Pet pet) {
		RestPreconditions.checkNotNull(pet);
		RestPreconditions.checkNotNull(this.ownerService.findOwnerById(ownerId));
		try {
			//Owner owner = this.ownerService.findOwnerById(ownerId);
			//owner.addPet(pet);
			this.petService.savePet(pet);
		} catch (DuplicatedPetNameException ex) {

		}
	}

	@PutMapping(value = "/pets/{petId}/edit")
	@ResponseStatus(HttpStatus.OK)
	public void update(@RequestBody Pet pet, @PathVariable("petId") int petId) {
		RestPreconditions.checkNotNull(pet);
		RestPreconditions.checkNotNull(petService.findPetById(pet.getId()));
		Pet petToUpdate = this.petService.findPetById(petId);
		BeanUtils.copyProperties(pet, petToUpdate, "id", "owner", "visits");
		try {
			this.petService.savePet(petToUpdate);
		} catch (DuplicatedPetNameException ex) {
		}

	}
	

	@GetMapping("/api/v1/pets")
	public List<Pet> findAll() {
		return StreamSupport.stream(petService.findAll().spliterator(), false)
				.collect(Collectors.toList());
	}
	
	@GetMapping("/api/v1/owners/{ownerId}/pets")
	public List<Pet> findAllPetsOfOwner(@PathVariable("ownerId") int ownerId) {
		return petService.findAllPetsByOwnerId(ownerId);
	}
	
	@GetMapping(value = "/api/v1/pets/{petId}")
    public ResponseEntity<Pet> findById(@PathVariable("petId") int petId) {
		return new ResponseEntity<Pet>(petService.findPetById(petId),HttpStatus.OK);
    }
	
	@PostMapping("/api/v1/owners/{ownerId}/pets")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Pet> create(@RequestBody Pet pet, @PathVariable("ownerId") int ownerId)
			throws URISyntaxException, DataAccessException, DuplicatedPetNameException{
		Owner owner = ownerService.findOwnerById(ownerId);
		RestPreconditions.checkNotNull(pet);
		Pet newPet = new Pet();
		BeanUtils.copyProperties(pet, newPet,"id");
		newPet.setOwner(owner);
		Pet savedPet = this.petService.savePet(newPet);
		
		return ResponseEntity.created(new URI("/clients/" + savedPet.getId())).body(savedPet);
		//return new ResponseEntity<Owner>(this.ownerService.saveOwner(owner),HttpStatus.CREATED);
	}


	@PutMapping(value = "/api/v1/owners/{ownerId}/pets/{petId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Pet> update(@PathVariable("petId") int petId,@PathVariable("ownerId") int ownerId,
			@RequestBody @Valid Pet pet ) {
		 RestPreconditions.checkNotNull(pet);
	     RestPreconditions.checkNotNull(ownerService.findOwnerById(ownerId));
	     return new ResponseEntity<Pet>(this.petService.updatePet(pet,petId),HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/api/v1/owners/{ownerId}/pets/{petId}")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable("petId") int id) {
        petService.deletePet(id);
    }

}
