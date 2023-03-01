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
package org.springframework.samples.petclinic.user;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.util.RestPreconditions;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
@RequestMapping("/api/v1/users")
class UserRestController {

	private final UserService userService;
	private final AuthoritiesService authService;

	@Autowired
	public UserRestController(UserService userService, AuthoritiesService authService) {
		this.userService = userService;
		this.authService = authService;
	}
	
	@GetMapping
	public List<User> findAll(@RequestParam(required = false) String auth) {
		if(auth != null) {
			return StreamSupport.stream(userService.findAll().spliterator(), false)
					.filter(user->user.getAuthority().getAuthority().equals(auth))
					.collect(Collectors.toList());
		}else return (List<User>) userService.findAll();
//			return StreamSupport.stream(userService.findAll().spliterator(), false)
//				.collect(Collectors.toList());
	}
	
	@GetMapping("authorities")
	public List<Authorities> findAllAuths() {
		return (List<Authorities>) authService.findAll();
	}
	
	@GetMapping(value = "{id}")
    public ResponseEntity<User> findById(@PathVariable("id") Integer id) {
		return new ResponseEntity<User>(userService.findUser(id),HttpStatus.OK);
    }
	
	@PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@RequestBody @Valid User user) {
        userService.saveUser(user);
    }
	
	@PutMapping(value = "{userId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<User> update(@PathVariable("userId") Integer id, @RequestBody @Valid User user ) {
	     RestPreconditions.checkNotNull(userService.findUser(id),"User", "ID", id);
	     return new ResponseEntity<User>(this.userService.updateUser(user,id),HttpStatus.OK);
	}
	
	@DeleteMapping(value = "{userId}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<MessageResponse> delete(@PathVariable("userId") int id) {
		try {
			RestPreconditions.checkNotNull(userService.findUser(id), "User", "ID", id);
			if(userService.findCurrentUser().getId()!=id) {
				userService.deleteUser(id);
				return new ResponseEntity<MessageResponse>(new MessageResponse("User deleted!"),HttpStatus.OK);
			}else return new ResponseEntity<MessageResponse>(new MessageResponse("You can't delete yourself!"),HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()),HttpStatus.BAD_REQUEST);
		}
    }

}
