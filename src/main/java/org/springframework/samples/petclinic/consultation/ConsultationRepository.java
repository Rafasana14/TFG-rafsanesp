package org.springframework.samples.petclinic.consultation;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.samples.petclinic.pet.Pet;

public interface ConsultationRepository extends CrudRepository<Consultation, Integer> {

	@Query("SELECT c FROM Consultation c WHERE c.pet.owner.id = :ownerId ORDER BY c.creationDate DESC")
	public List<Consultation> findConsultationsByOwner(@Param("ownerId") int ownerId);

	public Iterable<Consultation> findAllByOrderByCreationDateDesc();

	// STATS
	// ADMIN
	@Query("SELECT COUNT(c) FROM Consultation c")
	public Integer countAll();

	@Query("SELECT COUNT(o) FROM Owner o WHERE o.plan = 'PLATINUM'")
	public Integer countAllPlatinums();

	@Query("SELECT COUNT(o) FROM Owner o")
	public Integer countAllOwners();

	// OWNER
	@Query("SELECT COUNT(c) FROM Consultation c WHERE c.pet.owner.id = :ownerId")
	public Integer countAllByOwner(int ownerId);

	@Query("SELECT COUNT(p) FROM Pet p WHERE p.owner.id = :ownerId")
	public Integer countAllPetsOfOwner(int ownerId);
	
	@Query("SELECT p FROM Pet p WHERE p.owner.id = :ownerId")
	public List<Pet> findAllPetsByOwner(int ownerId);

	@Query("SELECT NEW MAP(c.pet.name as pet, cast(COUNT(c) as string) as consultations)"
			+ " FROM  Consultation c WHERE c.pet.owner.id = :ownerId GROUP BY c.pet")
	public List<Map<String, String>> countConsultationsGroupedByPet(int ownerId);

	@Query("SELECT MIN(YEAR(c.creationDate)) FROM Consultation c WHERE c.pet.owner.id = :ownerId")
	public Integer getYearOfFirstConsultation(int ownerId);

	@Query("SELECT NEW MAP(YEAR(c.creationDate) as year, cast(COUNT(c) as integer) as consultations)"
			+ " FROM  Consultation c WHERE c.pet.owner.id = :ownerId GROUP BY YEAR(c.creationDate)")
	public List<Map<String, Integer>> countConsultationsGroupedByYear(int ownerId);

}
