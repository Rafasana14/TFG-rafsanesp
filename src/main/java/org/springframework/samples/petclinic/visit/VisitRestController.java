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
package org.springframework.samples.petclinic.visit;

import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.exceptions.LimitReachedException;
import org.springframework.samples.petclinic.exceptions.ResourceNotOwnedException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.pet.Pet;
import org.springframework.samples.petclinic.pet.PetService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.util.RestPreconditions;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import petclinic.payload.response.MessageResponse;

@RestController
public class VisitRestController {

	private final PetService petService;
	private final VisitService visitService;
	private final UserService userService;
	private final OwnerService ownerService;

	@Autowired
	public VisitRestController(PetService petService, UserService userService, OwnerService ownerService,
			VisitService visitService) {
		this.petService = petService;
		this.userService = userService;
		this.ownerService = ownerService;
		this.visitService = visitService;
	}

	@InitBinder("visit")
	public void initVisitBinder(WebDataBinder dataBinder) {
		dataBinder.setValidator(new VisitValidator());
	}

	@GetMapping("/api/v1/pets/{petId}/visits")
	public ResponseEntity<List<Visit>> findAll(@PathVariable("petId") int petId) {
		Pet pet = RestPreconditions.checkNotNull(petService.findPetById(petId), "Pet", "ID", petId);
		User user = userService.findCurrentUser();
		if (user.hasAnyAuthority("ADMIN", "VET")) {
			List<Visit> res = StreamSupport.stream(visitService.findVisitsByPetId(petId).spliterator(), false)
					.collect(Collectors.toList());
			return new ResponseEntity<List<Visit>>(res, HttpStatus.OK);
		} else {
			Owner owner = ownerService.findOwnerByUser(user.getId());
			if (owner.getId().equals(pet.getOwner().getId())) {
				List<Visit> res = StreamSupport.stream(visitService.findVisitsByPetId(petId).spliterator(), false)
						.collect(Collectors.toList());
				return new ResponseEntity<List<Visit>>(res, HttpStatus.OK);
			}else throw new ResourceNotOwnedException(Pet.class.getName());
		}
	}

	@PostMapping("/api/v1/pets/{petId}/visits")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Visit> create(@PathVariable("petId") int petId, @RequestBody @Valid Visit visit)
			throws URISyntaxException {
		Pet pet = RestPreconditions.checkNotNull(petService.findPetById(petId), "Pet", "ID", petId);
		User user = userService.findCurrentUser();
		Visit newVisit = new Visit();
		Visit savedVisit;
		BeanUtils.copyProperties(visit, newVisit, "id");
		visit.setPet(pet);
		if (user.hasAuthority("OWNER")) {
			Owner owner = pet.getOwner();
			if (this.visitService.underLimit(visit)) {
				savedVisit = this.visitService.saveVisit(newVisit);
			} else
				throw new LimitReachedException("Visits per month for your Pet " + pet.getName(), owner.getPlan());
		} else
			savedVisit = this.visitService.saveVisit(newVisit);

//			return ResponseEntity.created(new URI("/api/v1/pets/" + petId + "/visits/" + savedVisit.getId()))
//					.body(savedVisit);
		return new ResponseEntity<Visit>(savedVisit, HttpStatus.CREATED);
	}

	@PutMapping("/api/v1/pets/{petId}/visits/{visitId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Visit> update(@PathVariable("petId") int petId, @PathVariable("visitId") int visitId,
			@RequestBody @Valid Visit visit) {
		RestPreconditions.checkNotNull(visitService.findVisitById(visitId), "Visit", "ID", visitId);
		RestPreconditions.checkNotNull(petService.findPetById(petId), "Pet", "ID", petId);
		return new ResponseEntity<Visit>(this.visitService.updateVisit(visit, visitId), HttpStatus.OK);
	}

	@GetMapping("/api/v1/pets/{petId}/visits/{visitId}")
	public ResponseEntity<Visit> findById(@PathVariable("visitId") int visitId) {
		RestPreconditions.checkNotNull(visitService.findVisitById(visitId), "Visit", "ID", visitId);
		Visit visit = visitService.findVisitById(visitId);
		User user = userService.findCurrentUser();
		if (user.hasAnyAuthority("ADMIN", "VET")){
			return new ResponseEntity<Visit>(visit, HttpStatus.OK);
		} else {
			Owner owner = ownerService.findOwnerByUser(user.getId());
			if (owner.getId() == visit.getPet().getOwner().getId())
				return new ResponseEntity<Visit>(visit, HttpStatus.OK);
			else
				throw new ResourceNotOwnedException(Visit.class.getSimpleName());
		}
	}

	@DeleteMapping("/api/v1/pets/{petId}/visits/{visitId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<MessageResponse> delete(@PathVariable("petId") int petId,
			@PathVariable("visitId") int visitId) {
		Pet pet = RestPreconditions.checkNotNull(petService.findPetById(petId), "Pet", "ID", petId);
		RestPreconditions.checkNotNull(visitService.findVisitById(visitId), "Visit", "ID", visitId);
		User user = userService.findCurrentUser();
		if (user.hasAuthority("ADMIN")
				|| ownerService.findOwnerByUser(user.getId()).getId() == pet.getOwner().getId()) {
			visitService.deleteVisit(visitId);
			return new ResponseEntity<MessageResponse>(new MessageResponse("Visit deleted!"), HttpStatus.OK);
		} else
			throw new ResourceNotOwnedException(Visit.class.getSimpleName());
	}

	@GetMapping("/api/v1/visits")
	public ResponseEntity<?> findAllByOwner(@RequestParam(required = false) Integer ownerId) {
		User user = userService.findCurrentUser();
		if (ownerId != null) {
			RestPreconditions.checkNotNull(ownerService.findOwnerById(ownerId), "Owner", "ID", ownerId);
			if (user.hasAnyAuthority("ADMIN", "VET")) {
				List<Visit> res = StreamSupport.stream(visitService.findVisitsByOwnerId(ownerId).spliterator(), false)
						.collect(Collectors.toList());
				return new ResponseEntity<List<Visit>>(res, HttpStatus.OK);
			} else {
				return new ResponseEntity<MessageResponse>(new MessageResponse("You can only see your own visits!"),
						HttpStatus.OK);
			}
		} else {
			if (user.hasAuthority("OWNER")) {
				Owner logged = ownerService.findOwnerByUser(user.getId());
				List<Visit> res = StreamSupport
						.stream(visitService.findVisitsByOwnerId(logged.getId()).spliterator(), false)
						.collect(Collectors.toList());
				return new ResponseEntity<List<Visit>>(res, HttpStatus.OK);
			} else {
				List<Visit> res = StreamSupport.stream(visitService.findAll().spliterator(), false)
						.collect(Collectors.toList());
				return new ResponseEntity<List<Visit>>(res, HttpStatus.OK);
			}

		}
	}

}
