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

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/plan")
public class OwnerPlanController {

	private final OwnerService ownerService;
	private final UserService userService;

	@Autowired
	public OwnerPlanController(OwnerService ownerService, UserService userService) {
		this.ownerService = ownerService;
		this.userService = userService;
	}

	
	@GetMapping
    public ResponseEntity<Owner> getPlan() {
		User user = userService.findCurrentUser();
		return new ResponseEntity<Owner>(ownerService.findOwnerByUser(user.getId()),HttpStatus.OK);
    }

	@PutMapping
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Owner> updatePlan(@RequestBody @Valid PricingPlan plan ) {
		 User user = userService.findCurrentUser();
		 Owner owner = ownerService.findOwnerByUser(user.getId());
	     return new ResponseEntity<Owner>(this.ownerService.updatePlan(plan,owner.getId()),HttpStatus.OK);
	}
}