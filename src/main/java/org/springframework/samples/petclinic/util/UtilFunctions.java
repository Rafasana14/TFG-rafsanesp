package org.springframework.samples.petclinic.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class UtilFunctions {
	
	private UtilFunctions() {
	    throw new IllegalStateException("Utility class");
	  }
	
	public static BigDecimal round(Integer places, Double value) {
		BigDecimal bd = BigDecimal.valueOf(value);
		bd = bd.setScale(places, RoundingMode.HALF_UP);
		return bd;
	}
}
