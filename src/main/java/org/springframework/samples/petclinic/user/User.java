package org.springframework.samples.petclinic.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.samples.petclinic.model.BaseEntity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity{
	
	@Column(unique=true)
	String username;
	
	String password;
	
	//private String token;
	
	//boolean enabled;
	
//	@NotNull
//	PricingPlan plan;
	
	
	@ManyToOne
	@JoinColumn(name = "authority")
	Authorities authority;
	
//	@ManyToMany(fetch = FetchType.LAZY)
//	@JoinTable(	name = "user_roles", 
//				joinColumns = @JoinColumn(name = "user_id"), 
//				inverseJoinColumns = @JoinColumn(name = "role_id"))
//	private Set<Role> roles = new HashSet<>();
}
