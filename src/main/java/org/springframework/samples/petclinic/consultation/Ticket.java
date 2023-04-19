package org.springframework.samples.petclinic.consultation;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.user.User;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "consultation_tickets")
@Getter
@Setter
public class Ticket extends BaseEntity {

	@Column(name = "description")
	@NotEmpty
	private String description;

	@Column(name = "creation_date")
	@CreationTimestamp
	private LocalDateTime creationDate;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Valid
	@ManyToOne()
	protected Consultation consultation;

}
