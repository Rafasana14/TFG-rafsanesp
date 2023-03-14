package org.springframework.samples.petclinic.vet;

import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/vets/specialties")
public class SpecialtyRestController {
	
	private final VetService vetService;

	public SpecialtyRestController(VetService clinicService) {
		this.vetService = clinicService;
	}
	
	@GetMapping
	public List<Specialty> findAll() {
		System.out.println(StreamSupport.stream(vetService.findSpecialties().spliterator(), false)
				.collect(Collectors.toList()));
		return StreamSupport.stream(vetService.findSpecialties().spliterator(), false)
				.collect(Collectors.toList());
	}
	
	@GetMapping(value = "{specialtyId}")
    public ResponseEntity<Specialty> findById(@PathVariable("specialtyId") int id) {
		return new ResponseEntity<Specialty>(vetService.findSpecialtyById(id),HttpStatus.OK);
    }
	
	@PostMapping()
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Specialty> create(@RequestBody Specialty specialty) throws URISyntaxException{
		Specialty newSpecialty = new Specialty();
		BeanUtils.copyProperties(specialty, newSpecialty,"id");
		Specialty savedSpecialty = this.vetService.saveSpecialty(newSpecialty);
		
		return new ResponseEntity<Specialty>(savedSpecialty,HttpStatus.CREATED);
	}


	@PutMapping(value = "{specialtyId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Specialty> update(@PathVariable("specialtyId") int specialtyId, @RequestBody @Valid Specialty specialty ) {
	     RestPreconditions.checkNotNull(vetService.findSpecialtyById(specialtyId), "Specialty", "ID", specialtyId);
	     return new ResponseEntity<Specialty>(this.vetService.updateSpecialty(specialty,specialtyId),HttpStatus.OK);
	}
	
	@DeleteMapping(value = "{specialtyId}")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable("specialtyId") int id) {
		RestPreconditions.checkNotNull(vetService.findSpecialtyById(id), "Specialty", "ID", id);
        vetService.deleteSpecialty(id);
    }

}
