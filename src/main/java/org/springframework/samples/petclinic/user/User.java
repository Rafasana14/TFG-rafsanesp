package org.springframework.samples.petclinic.user;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User{
	@Id
	String username;
	
	String password;
	
	boolean enabled;
	
//	@OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
//	private Set<Authorities> authorities;
}
