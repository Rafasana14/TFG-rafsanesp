package org.springframework.samples.petclinic.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
@Getter
public class UniqueException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1461835347378078101L;
	
	public UniqueException(String field) {
		super(String.format("%s already exists!", field));
	}
	
}
