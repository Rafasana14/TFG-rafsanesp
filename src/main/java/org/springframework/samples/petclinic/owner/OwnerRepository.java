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
package org.springframework.samples.petclinic.owner;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.samples.petclinic.pet.Pet;


public interface OwnerRepository extends CrudRepository<Owner, Integer> {

	@Query("SELECT DISTINCT owner FROM Owner owner WHERE owner.lastName LIKE :lastName%")
	public Collection<Owner> findByLastName(@Param("lastName") String lastName);

	@Query("SELECT p FROM Pet p WHERE p.owner.id = :ownerId")
	public List<Pet> findPetsByOwner(@Param("ownerId") int ownerId);
	
	@Modifying
	@Query("UPDATE Pet p SET p.owner = NULL WHERE p.owner.id = :ownerId")
	public void setOwnerNullInPets(@Param("ownerId") int ownerId);
	
	@Modifying
	@Query("UPDATE Consultation c SET c.status = 2 WHERE c.pet.id IN (SELECT p.id FROM Pet p JOIN p.owner o WHERE o.id = :ownerId)")
	public void setStatusClosedInConsultations(@Param("ownerId") int ownerId);
	
	@Modifying
	@Query("UPDATE Ticket t SET t.user = NULL WHERE t.user.id = :userId")
	public void setUserNullInTickets(@Param("userId") int userId);

	@Query("SELECT DISTINCT owner FROM Owner owner WHERE owner.user.id = :userId")
	public Optional<Owner> findByUser(int userId);

	// STATS

	@Query("SELECT COUNT(o) FROM Owner o WHERE o.plan = :plan")
	public Integer countByPlan(PricingPlan plan);
	
	@Query("SELECT NEW MAP(cast(o.plan as string) as plan, cast(COUNT(o) as string) as owners)"
			+ " FROM Owner o GROUP BY o.plan")
	public List<Map<String, String>> countOwnersGroupedByPlan();

	@Query("SELECT COUNT(o) FROM Owner o")
	public Integer countAll();
	
	@Query("SELECT COUNT(p) FROM Pet p WHERE p.owner.id = :ownerId")
	public Integer countAllPetsOfOwner(int ownerId);

	@Query("SELECT NEW MAP(v.pet.owner.id as userId, cast(COUNT(v) as integer) as visits) FROM  Visit v GROUP BY v.pet.owner")
	public List<Map<String, Integer>> getOwnersWithMostVisits();

}
