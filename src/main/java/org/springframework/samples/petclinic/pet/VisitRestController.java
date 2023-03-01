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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.exceptions.ResourceNotOwnedException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
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
 * @author Michael Isvy
 */
@RestController
public class VisitRestController {

	private final PetService petService;
	private final UserService userService;
	private final OwnerService ownerService;

	@Autowired
	public VisitRestController(PetService petService, UserService userService, OwnerService ownerService) {
		this.petService = petService;
		this.userService = userService;
		this.ownerService = ownerService;
	}

	// ADMIN

	@GetMapping("/api/v1/pets/{petId}/visits")
	public ResponseEntity<?> findAll(@PathVariable("petId") int petId) {
		try {
			Pet pet = RestPreconditions.checkNotNull(petService.findPetById(petId), "Pet", "ID", petId);
			User user = userService.findCurrentUser();
			Owner logged = null, owner = null;
			if (user.hasAuthority("OWNER")) {
				logged = ownerService.findOwnerByUser(user.getId());
				owner = pet.getOwner();
			}
			if (user.hasAuthority("ADMIN") || user.hasAuthority("VET") || logged.getId() == owner.getId()) {
				List<Visit> res = StreamSupport.stream(petService.findVisitsByPetId(petId).spliterator(), false)
						.collect(Collectors.toList());
				return new ResponseEntity<List<Visit>>(res, HttpStatus.OK);
			} else {
				throw new ResourceNotOwnedException(Pet.class.getName());
			}
		} catch (Exception e) {
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/api/v1/pets/{petId}/visits")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> create(@PathVariable("petId") int petId, @RequestBody @Valid Visit visit)
			throws URISyntaxException {
		try {
			Pet pet = RestPreconditions.checkNotNull(petService.findPetById(petId), "Pet", "ID", petId);
			Visit newVisit = new Visit();
			BeanUtils.copyProperties(visit, newVisit, "id");
			visit.setPet(pet);
			Visit savedVisit = this.petService.saveVisit(newVisit);
			
			return ResponseEntity.created(new URI("/api/v1/pets/" + petId + "/visits/" + savedVisit.getId()))
					.body(savedVisit);
		} catch (Exception e) {
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
//		 return new ResponseEntity<Pet>(savedPet,HttpStatus.CREATED);
	}

	@PutMapping(value = "/api/v1/pets/{petId}/visits/{visitId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> update(@PathVariable("petId") int petId, @PathVariable("visitId") int visitId,
			@RequestBody @Valid Visit visit) {
		try {
			RestPreconditions.checkNotNull(petService.findVisitById(visitId), "Visit", "ID", visitId);
			RestPreconditions.checkNotNull(petService.findPetById(petId), "Pet", "ID", petId);
			return new ResponseEntity<Visit>(this.petService.updateVisit(visit, visitId), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping(value = "/api/v1/pets/{petId}/visits/{visitId}")
	public ResponseEntity<?> findById(@PathVariable("visitId") int visitId) {
		try {
			RestPreconditions.checkNotNull(petService.findVisitById(visitId), "Visit", "ID", visitId);
			Visit visit = petService.findVisitById(visitId);
			User user = userService.findCurrentUser();
			if (user.hasAuthority("VET") || user.hasAuthority("VET")) {
				return new ResponseEntity<Visit>(visit, HttpStatus.OK);
			} else {
				Owner owner = ownerService.findOwnerByUser(user.getId());
				if (owner.getId() == visit.getPet().getOwner().getId())
					return new ResponseEntity<Visit>(visit, HttpStatus.OK);
				else throw new ResourceNotOwnedException(Visit.class.getSimpleName());
			}
		} catch (Exception e) {
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
	}

	@DeleteMapping(value = "/api/v1/pets/{petId}/visits/{visitId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<MessageResponse> delete(@PathVariable("petId") int petId,
			@PathVariable("visitId") int visitId) {
		try {
			Pet pet = RestPreconditions.checkNotNull(petService.findPetById(petId), "Pet", "ID", petId);
			RestPreconditions.checkNotNull(petService.findVisitById(visitId), "Visit", "ID", visitId);
			User user = userService.findCurrentUser();
			if (user.hasAuthority("ADMIN")
					|| ownerService.findOwnerByUser(user.getId()).getId() == pet.getOwner().getId()) {
				petService.deleteVisit(visitId);
				return new ResponseEntity<MessageResponse>(new MessageResponse("Visit deleted!"), HttpStatus.OK);
			} else
				throw new ResourceNotOwnedException(Visit.class.getSimpleName());
		} catch (Exception e) {
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
	}

//	@PostMapping(value = "/api/v1/owners/{ownerId}/pets/{petId}/visits/new")
//	@ResponseStatus(HttpStatus.CREATED)
//	public Visit createNewVisit(@PathVariable("petId") int petId, @RequestBody Visit visit, BindingResult result) {
//		Pet pet = this.petService.findPetById(petId);
//		pet.addVisit(visit);
//		this.petService.saveVisit(visit);
//		return visit;
//	}
//
//	@GetMapping(value = "/api/v1/owners/*/pets/{petId}/visits")
//	public List<Visit> showVisits(@PathVariable int petId, Map<String, Object> model) {
//		return this.petService.findPetById(petId).getVisits();
//	}

}
