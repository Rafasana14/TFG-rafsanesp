package org.springframework.samples.petclinic.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
@Getter
public class ResourceNotOwnedException extends RuntimeException {

	private static final long serialVersionUID = -3906338266891937036L;

//	private String resourceName;

//	public ResourceNotOwnedException(String resourceName) {
//		super(String.format("You can't create or change %s for another person.", resourceName));
//		this.resourceName = resourceName;
//
//	}

	public ResourceNotOwnedException(final String classname) {
		super(String.format("%s not owned.", classname));
	}

}
