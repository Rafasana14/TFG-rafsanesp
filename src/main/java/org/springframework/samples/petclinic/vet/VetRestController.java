package org.springframework.samples.petclinic.vet;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.exceptions.AccessDeniedException;
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
@RequestMapping("/api/v1/vets")
public class VetRestController {

	private final VetService vetService;
	private final UserService userService;

	@Autowired
	public VetRestController(VetService clinicService, UserService userService) {
		this.vetService = clinicService;
		this.userService = userService;
	}

	@GetMapping
	public ResponseEntity<List<Vet>> findAll() {
		List<Vet> res = (List<Vet>) this.vetService.findAll();
		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	@GetMapping(value = "{vetId}")
	public ResponseEntity<Vet> findById(@PathVariable("vetId") int id) {
		return new ResponseEntity<>(vetService.findVetById(id), HttpStatus.OK);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Vet> create(@RequestBody @Valid Vet vet) {
		Vet newVet = new Vet();
		BeanUtils.copyProperties(vet, newVet, "id");
		Vet savedVet = this.vetService.saveVet(newVet);

		return new ResponseEntity<>(savedVet, HttpStatus.CREATED);
	}

	@PutMapping(value = "{vetId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Vet> update(@PathVariable("vetId") int vetId, @RequestBody @Valid Vet vet) {
		RestPreconditions.checkNotNull(vetService.findVetById(vetId), "Vet", "ID", vetId);
		return new ResponseEntity<>(this.vetService.updateVet(vet, vetId), HttpStatus.OK);
	}

	@DeleteMapping(value = "{vetId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<MessageResponse> delete(@PathVariable("vetId") int id) {
		RestPreconditions.checkNotNull(vetService.findVetById(id), "Vet", "ID", id);
		vetService.deleteVet(id);
		return new ResponseEntity<>(new MessageResponse("Vet deleted!"), HttpStatus.OK);
	}

	@GetMapping(value = "stats")
	public ResponseEntity<Map<String, Object>> getStats() {
		return new ResponseEntity<>(this.vetService.getVetsStats(), HttpStatus.OK);
	}

	@GetMapping(value = "profile")
	public ResponseEntity<Vet> getProfile() {
		User user = userService.findCurrentUser();
		if (user.hasAuthority("VET").equals(true))
			return new ResponseEntity<>(this.vetService.findVetByUser(user.getId()), HttpStatus.OK);
		else
			throw new AccessDeniedException();
	}
	
	@PutMapping(value = "profile")
	public ResponseEntity<Vet> updateProfile(@RequestBody @Valid Vet vet) {
		User user = userService.findCurrentUser();
		if (user.hasAuthority("VET").equals(true)) {
			this.userService.updateUser(vet.getUser(), user.getId());
			Vet aux = this.vetService.findVetByUser(user.getId());
			return new ResponseEntity<>(this.vetService.updateVet(vet, aux.getId()), HttpStatus.OK);
		}
		else
			throw new AccessDeniedException();
	}

}
