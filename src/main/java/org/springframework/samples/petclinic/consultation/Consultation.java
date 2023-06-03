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
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.pet.Pet;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "consultations")
@Getter
@Setter
public class Consultation extends BaseEntity {

	@Column(name = "title")
	@NotEmpty
	private String title;

	@NotNull
	private ConsultationStatus status;

	@OneToOne
	@JoinColumn(name = "pet_id")
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Pet pet;

	@Column(name = "creation_date")
	@CreationTimestamp
	private LocalDateTime creationDate;

}
