package org.springframework.samples.petclinic.vet;

import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

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
	public List<Vet> findAll() {
		return StreamSupport.stream(vetService.findVets().spliterator(), false).collect(Collectors.toList());
	}

	@GetMapping(value = "{vetId}")
	public ResponseEntity<Vet> findById(@PathVariable("vetId") int id) {
		return new ResponseEntity<Vet>(vetService.findVetById(id), HttpStatus.OK);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> create(@RequestBody @Valid Vet vet) throws URISyntaxException {
		try {
			Vet newVet = new Vet();
			BeanUtils.copyProperties(vet, newVet, "id");
			User user = userService.findCurrentUser();
			newVet.setUser(user);
			Vet savedVet = this.vetService.saveVet(newVet);

			return new ResponseEntity<Vet>(savedVet, HttpStatus.CREATED);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new ResponseEntity<MessageResponse>(new MessageResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
		} 
	}

	@PutMapping(value = "{vetId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Vet> update(@PathVariable("vetId") int vetId, @RequestBody @Valid Vet vet) {
		RestPreconditions.checkNotNull(vetService.findVetById(vetId), "Vet", "ID", vetId);
		return new ResponseEntity<Vet>(this.vetService.updateVet(vet, vetId), HttpStatus.OK);
	}

	@DeleteMapping(value = "{vetId}")
	@ResponseStatus(HttpStatus.OK)
	public void delete(@PathVariable("vetId") int id) {
		RestPreconditions.checkNotNull(vetService.findVetById(id), "Vet", "ID", id);
		vetService.deleteVet(id);
	}

	@PutMapping(value = "{vetId}/specialties/{specialtyId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Vet> addSpecialty(@PathVariable("vetId") int vetId,
			@PathVariable("specialtyId") int specialtyId) {
		RestPreconditions.checkNotNull(vetService.findSpecialtyById(specialtyId), "Specialty", "ID", specialtyId);
		RestPreconditions.checkNotNull(vetService.findVetById(vetId), "Vet", "ID", vetId);
		return new ResponseEntity<Vet>(
				this.vetService.addSpecialty(vetService.findVetById(vetId), vetService.findSpecialtyById(specialtyId)),
				HttpStatus.OK);
	}
	
	@DeleteMapping(value = "{vetId}/specialties/{specialtyId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Vet> removeSpecialty(@PathVariable("vetId") int vetId,
			@PathVariable("specialtyId") int specialtyId) {
		RestPreconditions.checkNotNull(vetService.findSpecialtyById(specialtyId), "Specialty", "ID", specialtyId);
		RestPreconditions.checkNotNull(vetService.findVetById(vetId), "Vet", "ID", vetId);
		return new ResponseEntity<Vet>(
				this.vetService.removeSpecialty(vetService.findVetById(vetId), vetService.findSpecialtyById(specialtyId)),
				HttpStatus.OK);
	}

}
