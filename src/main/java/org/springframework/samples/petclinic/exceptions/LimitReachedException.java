package org.springframework.samples.petclinic.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.samples.petclinic.owner.PricingPlan;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
@Getter
public class LimitReachedException extends RuntimeException {

	private static final long serialVersionUID = -3906338266891937036L;

	private String resourceName;
	private PricingPlan plan;

	public LimitReachedException(String resourceName, PricingPlan plan) {
		super(String.format(
				"You have reached the limit for %s with the %s plan. Please, upgrade your plan or contact an administrator.",
				resourceName, plan));
		this.resourceName = resourceName;
		this.plan = plan;
	}

}
