package org.springframework.samples.petclinic.consultation;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ConsultationRepository extends CrudRepository<Consultation, Integer> {

	@Query("SELECT c FROM Consultation c WHERE c.owner.id = :ownerId ORDER BY c.creationDate DESC")
	public List<Consultation> findConsultationsByOwner(@Param("ownerId") int ownerId);

	@Query("SELECT c FROM Consultation c JOIN Ticket t WHERE t.consultation.id = c.id AND t.user.id = :userId ORDER BY c.creationDate DESC")
	public List<Consultation> findConsultationsByUser(@Param("userId") int userId);

	public Iterable<Consultation> findAllByOrderByCreationDateDesc();

//	@Query("SELECT c FROM Consultation c JOIN Vet v WHERE c.id = v.consul ORDER BY c.creationDate DESC")
//	public List<Consultation> findConsultationsByVet(@Param("vetId") int vetId);

}
