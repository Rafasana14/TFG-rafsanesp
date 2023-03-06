package org.springframework.samples.petclinic.vet;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface SpecialtyRepository extends CrudRepository<Specialty, Integer>{
	
//	@Modifying
//	@Query("DELETE i FROM vet_specialties i WHERE i.specialty_id = :id")
//	void deleteSpecialtyFromVets(int id);
	
	@Query("SELECT v FROM Vet v JOIN Specialty s WHERE s.id = :id")
	List<Vet> findVetsWithSpecialty(int id);

}
