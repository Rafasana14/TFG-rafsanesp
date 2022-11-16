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
import org.springframework.samples.petclinic.user.AuthoritiesService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.util.RestPreconditions;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
	private final UserService userService;

	@Autowired
	public OwnerRestController(OwnerService ownerService, UserService userService, AuthoritiesService authoritiesService) {
		this.ownerService = ownerService;
		this.userService = userService;
	}

//	@InitBinder
//	public void setAllowedFields(WebDataBinder dataBinder) {
//		dataBinder.setDisallowedFields("id");
//	}

	@GetMapping
	public List<Owner> findAll() {
		return StreamSupport.stream(ownerService.findAll().spliterator(), false)
				.collect(Collectors.toList());
	}
	
	@GetMapping(value = "{ownerId}")
    public ResponseEntity<Owner> findById(@PathVariable("ownerId") int id) {
		return new ResponseEntity<Owner>(ownerService.findOwnerById(id),HttpStatus.OK);
    }
	
	@PostMapping()
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Owner> create(@RequestBody Owner owner) throws URISyntaxException{
		RestPreconditions.checkNotNull(owner);
		Owner newOwner = new Owner();
		BeanUtils.copyProperties(owner, newOwner,"id");
		User user = userService.findUser(SecurityContextHolder.getContext().getAuthentication().getName());
		newOwner.setUser(user);
		Owner savedOwner = this.ownerService.saveOwner(newOwner);
		
		return ResponseEntity.created(new URI("/clients/" + savedOwner.getId())).body(savedOwner);
		//return new ResponseEntity<Owner>(this.ownerService.saveOwner(owner),HttpStatus.CREATED);
	}


	@PutMapping(value = "{ownerId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Owner> update(@PathVariable("ownerId") int ownerId, @RequestBody @Valid Owner owner ) {
		 RestPreconditions.checkNotNull(owner);
	     RestPreconditions.checkNotNull(ownerService.findOwnerById(owner.getId()));
	     return new ResponseEntity<Owner>(this.ownerService.updateOwner(owner,ownerId),HttpStatus.OK);
	}
	
	@DeleteMapping(value = "{ownerId}")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable("ownerId") int id) {
        ownerService.deleteOwner(id);
    }

}
