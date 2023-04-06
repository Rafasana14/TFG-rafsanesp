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

import java.net.URISyntaxException;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/v1/owners")
public class OwnerRestController {

	private final OwnerService ownerService;
	private final UserService userService;

	@Autowired
	public OwnerRestController(OwnerService ownerService, UserService userService) {
		this.ownerService = ownerService;
		this.userService = userService;
	}

	@GetMapping
	public List<Owner> findAll() {
		return (List<Owner>) ownerService.findAll();
	}
	
	@GetMapping(value = "{ownerId}")
    public ResponseEntity<Owner> findById(@PathVariable("ownerId") int id) {
		return new ResponseEntity<Owner>(ownerService.findOwnerById(id),HttpStatus.OK);
    }
	
	@PostMapping()
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Owner> create(@RequestBody @Valid Owner owner) throws URISyntaxException{
		Owner newOwner = new Owner();
		BeanUtils.copyProperties(owner, newOwner,"id");
		User user = userService.findCurrentUser();
		newOwner.setUser(user);
		Owner savedOwner = this.ownerService.saveOwner(newOwner);
		
		//return ResponseEntity.created(new URI("/clients/" + savedOwner.getId())).body(savedOwner);
		return new ResponseEntity<Owner>(savedOwner,HttpStatus.CREATED);
	}

	@PutMapping(value = "{ownerId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Owner> update(@PathVariable("ownerId") int ownerId, @RequestBody @Valid Owner owner ) {
	     RestPreconditions.checkNotNull(ownerService.findOwnerById(ownerId), "Owner", "ID", ownerId);
	     return new ResponseEntity<Owner>(this.ownerService.updateOwner(owner,ownerId),HttpStatus.OK);
	}
	
	@DeleteMapping(value = "{ownerId}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<MessageResponse> delete(@PathVariable("ownerId") int id) {
		RestPreconditions.checkNotNull(ownerService.findOwnerById(id), "Owner", "ID", id);
        ownerService.deleteOwner(id);
        return new ResponseEntity<MessageResponse>(new MessageResponse("Owner deleted!"), HttpStatus.OK);
    }

}
