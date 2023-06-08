package org.springframework.samples.petclinic.vet;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface SpecialtyRepository extends CrudRepository<Specialty, Integer>{

	Optional<Specialty> findByName(String name);

}
