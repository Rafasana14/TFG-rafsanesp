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

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Juergen Hoeller
 * @author Ken Krebs
 * @author Arjen Poutsma
 * @author Michael Isvy
 */
@RestController
public class VisitRestController {

	private final PetService petService;

	@Autowired
	public VisitRestController(PetService petService) {
		this.petService = petService;
	}

	@InitBinder
	public void setAllowedFields(WebDataBinder dataBinder) {
		dataBinder.setDisallowedFields("id");
	}

	@PostMapping(value = "/api/v1/owners/{ownerId}/pets/{petId}/visits/new")
	@ResponseStatus(HttpStatus.CREATED)
	public Visit createNewVisit(@PathVariable("petId") int petId, @RequestBody Visit visit, BindingResult result) {
		Pet pet = this.petService.findPetById(petId);
		pet.addVisit(visit);
		this.petService.saveVisit(visit);
		return visit;
	}

	@GetMapping(value = "/api/v1/owners/*/pets/{petId}/visits")
	public List<Visit> showVisits(@PathVariable int petId, Map<String, Object> model) {
		return this.petService.findPetById(petId).getVisits();
	}

}
