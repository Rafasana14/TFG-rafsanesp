package org.springframework.samples.petclinic.exceptions;

public class DuplicatedSpecialtyException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 5666517468212453765L;
	
	public DuplicatedSpecialtyException() {
		super("A specialty with this name already exists!");
	}

}
