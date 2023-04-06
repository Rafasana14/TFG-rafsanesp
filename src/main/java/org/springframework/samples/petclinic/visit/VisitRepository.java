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
package org.springframework.samples.petclinic.visit;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface VisitRepository extends CrudRepository<Visit, Integer> {

	@Query("SELECT v FROM Visit v WHERE v.pet.id = :petId ORDER BY v.datetime DESC")
	public List<Visit> findByPetId(Integer petId);

	@Query("SELECT v FROM Visit v WHERE v.pet.owner.id = :ownerId ORDER BY v.datetime DESC")
	public Collection<Visit> findByOwnerId(int ownerId);

	@Query("SELECT COUNT(v) FROM Visit v WHERE v.pet.id = :id AND MONTH(v.datetime) = :month AND YEAR(v.datetime) = :year")
	public Integer countVisitsByPetInMonth(int id, Integer month, Integer year);

}
