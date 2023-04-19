package org.springframework.samples.petclinic.consultation;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.util.TicketStatus;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "consultations")
@Getter
@Setter
public class Consultation extends BaseEntity{
	
	@Column(name = "title")
	@NotEmpty
	private String title;
	
	@NotNull
	private TicketStatus status;
	
	@OneToOne
	@JoinColumn(name = "owner_id", nullable = false)
	private Owner owner;
	
//	@OneToOne
//	@JoinColumn(name = "vet_id", nullable = false)
//	private Vet vet;
	
	@Column(name = "creation_date")
	@CreationTimestamp
	private LocalDateTime creationDate;
	
//	@OneToMany(orphanRemoval=true)
//    @JoinColumn(name="consultation_id") 
//    private Set<Vet> vets;


}
