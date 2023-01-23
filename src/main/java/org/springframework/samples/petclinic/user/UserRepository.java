package org.springframework.samples.petclinic.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.samples.petclinic.owner.Owner;


public interface UserRepository extends  CrudRepository<User, String>{
	
//	@Modifying
//	@Query("DELETE FROM Owner o WHERE o.user.username = :username")
//	void deleteOwnerOfUser(String username);
//	
//	@Modifying
//	@Query("DELETE FROM Pet p WHERE p.owner.id = :id")
//	public void deletePetsOfOwner(@Param("id") int id);
	
	@Query("SELECT o FROM Owner o WHERE o.user.username = :username")
	Optional<Owner> findOwnerByUser(String username);
	
}
