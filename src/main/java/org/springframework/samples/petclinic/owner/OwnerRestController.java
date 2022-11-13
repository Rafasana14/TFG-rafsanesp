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
package org.springframework.samples.petclinic.owner;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.samples.petclinic.user.AuthoritiesService;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Juergen Hoeller
 * @author Ken Krebs
 * @author Arjen Poutsma
 * @author Michael Isvy
 */
@RestController
@RequestMapping("/api/v1/owners")
public class OwnerRestController {

	private final OwnerService ownerService;

	@Autowired
	public OwnerRestController(OwnerService ownerService, UserService userService, AuthoritiesService authoritiesService) {
		this.ownerService = ownerService;
	}

	@InitBinder
	public void setAllowedFields(WebDataBinder dataBinder) {
		dataBinder.setDisallowedFields("id");
	}

	@GetMapping
	public List<Owner> findAll() {
		return StreamSupport.stream(ownerService.findAll().spliterator(), false)
				.collect(Collectors.toList());
	}
	
	@GetMapping(value = "/{ownerId}")
    public Owner findById(@PathVariable("ownerId") int id) {
        return RestPreconditions.checkFound(ownerService.findOwnerById(id));
    }
	
	@PostMapping(value = "/new")
	@ResponseStatus(HttpStatus.CREATED)
	public void create(@RequestBody Owner owner) {
		RestPreconditions.checkNotNull(owner);
		this.ownerService.saveOwner(owner);
	}


	@PutMapping(value = "/{ownerId}/edit")
	@ResponseStatus(HttpStatus.OK)
	public void processUpdateOwnerForm(@RequestBody Owner owner, @PathVariable("ownerId") int ownerId) {
		 RestPreconditions.checkNotNull(owner);
	     RestPreconditions.checkNotNull(ownerService.findOwnerById(owner.getId()));
	     ownerService.saveOwner(owner);
	}
	
	@DeleteMapping(value = "/{ownerId}")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable("ownerId") int id) {
        ownerService.deleteOwner(id);
    }

}
