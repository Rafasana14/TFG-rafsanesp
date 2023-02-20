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

	@Autowired
	public VisitRestController(PetService petService, UserService userService) {
		this.petService = petService;
		this.userService = userService;
	}
	
	//ADMIN
	
	@GetMapping("/api/v1/pets/{petId}/visits")
	public List<Visit> findAll(@PathVariable("petId") int petId) {
		return StreamSupport.stream(petService.findVisitsByPetId(petId).spliterator(), false).collect(Collectors.toList());
	}
	
	@PostMapping("/api/v1/pets/{petId}/visits")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Visit> create(@PathVariable("petId") int petId, @RequestBody Visit visit)
			throws URISyntaxException{
		RestPreconditions.checkNotNull(visit);
		Pet pet = RestPreconditions.checkNotNull(petService.findPetById(petId));
		Visit newVisit = new Visit();
		BeanUtils.copyProperties(visit, newVisit, "id");
		visit.setPet(pet);
		Visit savedVisit = this.petService.saveVisit(newVisit);

		return ResponseEntity.created(new URI("/api/v1/pets/" + petId + "/visits/" + savedVisit.getId()))
				.body(savedVisit);
//		 return new ResponseEntity<Pet>(savedPet,HttpStatus.CREATED);
	}

	@PutMapping(value = "/api/v1/pets/{petId}/visits/{visitId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> update(@PathVariable("petId") int petId, @PathVariable("visitId") int visitId,
			@RequestBody @Valid Visit visit) {
		try {
			RestPreconditions.checkNotNull(visit);
			RestPreconditions.checkNotNull(petService.findPetById(petId));
			return new ResponseEntity<Visit>(this.petService.updateVisit(visit, visitId), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping(value = "/api/v1/pets/{petId}/visits/{visitId}")
	public ResponseEntity<Visit> findById(@PathVariable("visitId") int visitId) {
		return new ResponseEntity<Visit>(petService.findVisitById(visitId), HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/api/v1/pets/{petId}/visits/{visitId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<MessageResponse> delete(@PathVariable("visitId") int id) {
		Visit visit;
		try {
			visit = RestPreconditions.checkNotNull(petService.findVisitById(id));
			User user = userService.findCurrentUser();
			if (user.getAuthority().getAuthority().equals("ADMIN")) {
				petService.deleteVisit(id);
				return new ResponseEntity<MessageResponse>(new MessageResponse("Visit deleted!"), HttpStatus.OK);
			} else
				throw new ResourceNotOwnedException(visit.getClass().getName());
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
