package org.springframework.samples.petclinic.vet;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/vets")
public class VetRestController {
	
	private final VetService vetService;

	@Autowired
	public VetRestController(VetService clinicService) {
		this.vetService = clinicService;
	}
	
	@GetMapping
	public List<Vet> showVetList(Map<String, Object> model) {
		return (List<Vet>) this.vetService.findVets();

	}

}
