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

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.pet.exceptions.DuplicatedPetNameException;
import org.springframework.samples.petclinic.util.RestPreconditions;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Juergen Hoeller
 * @author Ken Krebs
 * @author Arjen Poutsma
 */
@RestController
@RequestMapping("/api/v1/owners/{ownerId}")
public class PetRestController {

	private final PetService petService;
	private final OwnerService ownerService;

	@Autowired
	public PetRestController(PetService petService, OwnerService ownerService) {
		this.petService = petService;
		this.ownerService = ownerService;
	}

	@ModelAttribute("types")
	public Collection<PetType> populatePetTypes() {
		return this.petService.findPetTypes();
	}

	@ModelAttribute("owner")
	public Owner findOwner(@PathVariable("ownerId") int ownerId) {
		return this.ownerService.findOwnerById(ownerId);
	}

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

}
