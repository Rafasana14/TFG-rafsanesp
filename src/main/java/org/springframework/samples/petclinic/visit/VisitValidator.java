package org.springframework.samples.petclinic.visit;

import java.time.DayOfWeek;
import java.time.LocalDateTime;

import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

public class VisitValidator implements Validator {

	private static final String REQUIRED = "required";

	@Override
	public void validate(Object obj, Errors errors) {
		Visit visit = (Visit) obj;
		LocalDateTime datetime = visit.getDatetime();
		// date validation
		if (datetime == null || datetime.getHour() < 9 || datetime.getHour() >= 20
				|| datetime.getDayOfWeek().equals(DayOfWeek.SATURDAY)
				|| datetime.getDayOfWeek().equals(DayOfWeek.SUNDAY)) {
			errors.rejectValue("datetime",
					"Date and time are required and between 9:00 and 20:00 from Mondays to Fridays",
					"Date and time are required and between 9:00 and 20:00 from Mondays to Fridays");
		}

		// pet validation
		if (visit.getPet() == null) {
			errors.rejectValue("pet", REQUIRED, REQUIRED);
		}
	}

	/**
	 * This Validator validates *just* Visit instances
	 */
	@Override
	public boolean supports(Class<?> clazz) {
		return Visit.class.isAssignableFrom(clazz);
	}

}
