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
package org.springframework.samples.petclinic.vet;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import org.springframework.samples.petclinic.model.Person;
import org.springframework.samples.petclinic.user.User;

import lombok.Getter;
import lombok.Setter;

/**
 * Simple JavaBean domain object representing a veterinarian.
 *
 * @author Ken Krebs
 * @author Juergen Hoeller
 * @author Sam Brannen
 * @author Arjen Poutsma
 */
@Entity
@Table(name = "vets")
@Getter
@Setter
public class Vet extends Person {

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "vet_specialties", joinColumns = @JoinColumn(name = "vet_id"),
			inverseJoinColumns = @JoinColumn(name = "specialty_id"),uniqueConstraints={
				    @UniqueConstraint(columnNames = {"vet_id", "specialty_id"})
			})
	private List<Specialty> specialties;
	
	@OneToOne(cascade = {CascadeType.DETACH,CascadeType.REFRESH,CascadeType.PERSIST})
    @JoinColumn(name = "user", referencedColumnName = "id")
	private User user;

//	protected Set<Specialty> getSpecialtiesInternal() {
//		if (this.specialties == null) {
//			this.specialties = new HashSet<>();
//		}
//		return this.specialties;
//	}
//
//	protected void setSpecialtiesInternal(Set<Specialty> specialties) {
//		this.specialties = specialties;
//	}

//	@XmlElement
//	public List<Specialty> getSpecialties() {
//		List<Specialty> sortedSpecs = new ArrayList<>(getSpecialtiesInternal());
//		PropertyComparator.sort(sortedSpecs, new MutableSortDefinition("name", true, true));
//		return Collections.unmodifiableList(sortedSpecs);
//	}

	public int getNrOfSpecialties() {
		return getSpecialties().size();
	}

//	public void addSpecialty(Specialty specialty) {
//		getSpecialtiesInternal().add(specialty);
//	}

}
