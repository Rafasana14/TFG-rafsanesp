package org.springframework.samples.petclinic.owner;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.configuration.jwt.JwtUtils;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.user.Authorities;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.security.config.annotation.web.WebSecurityConfigurer;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Test class for {@link OwnerRestController}
 *
 */

//@WebMvcTest(OwnerRestController.class)
@WebMvcTest(value = OwnerRestController.class, excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = WebSecurityConfigurer.class))
@Import({ JwtUtils.class })
class OwnerRestControllerTests {

	private static final int TEST_OWNER_ID = 1;

	@Autowired
	private OwnerRestController ownerController;

	@MockBean
	private OwnerService ownerService;

	@MockBean
	private UserService userService;

//	@MockBean
//	UserDetailsServiceImpl userDetailsService;
//
//	@MockBean
//	AuthEntryPointJwt authEntryPoint;
//
//	@MockBean
//	DataSource dataSource;

	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	private MockMvc mockMvc;

	private Owner george;
	private Owner sara;
	private Owner juan;
	private User user;
//	private String adminJwt, ownerJwt;

	@Autowired
	private ObjectMapper objectMapper;

//	private String getToken(String username, String authorities) {
//		Authorities auth = new Authorities();
//		auth.setAuthority(authorities);
//		return jwtUtils.generateTokenFromUsername(username, auth);
//	}

	@BeforeEach
	void setup() {

		george = new Owner();
		george.setId(TEST_OWNER_ID);
		george.setFirstName("George");
		george.setLastName("Franklin");
		george.setAddress("110 W. Liberty St.");
		george.setCity("Sevilla");
		george.setTelephone("608555102");
		george.setPlan(PricingPlan.BASIC);

		sara = new Owner();
		sara.setId(2);
		sara.setFirstName("Sara");
		sara.setLastName("Franklin");
		sara.setAddress("110 W. Liberty St.");
		sara.setCity("Sevilla");
		sara.setTelephone("608555102");
		sara.setPlan(PricingPlan.BASIC);

		juan = new Owner();
		juan.setId(3);
		juan.setFirstName("Juan");
		juan.setLastName("Franklin");
		juan.setAddress("110 W. Liberty St.");
		juan.setCity("Sevilla");
		juan.setTelephone("608555102");
		juan.setPlan(PricingPlan.BASIC);

		Authorities ownerAuth = new Authorities();
		ownerAuth.setId(1);
		ownerAuth.setAuthority("OWNER");

		user = new User();
		user.setId(1);
		user.setUsername("user");
		user.setPassword("password");
		user.setAuthority(ownerAuth);

//		adminJwt = getToken("admin", "ADMIN");
//		ownerJwt = getToken("owner", "OWNER");

	}

	@Test
	@WithMockUser("admin")
	void shouldFindAll() throws Exception {
		
		when(this.ownerService.findAll()).thenReturn(List.of(george, sara, juan));
		mockMvc.perform(get("/api/v1/owners")).andExpect(status().isOk()).andExpect(jsonPath("$.size()").value(3))
				.andExpect(jsonPath("$[?(@.id == 1)].firstName").value("George"))
				.andExpect(jsonPath("$[?(@.id == 2)].firstName").value("Sara"))
				.andExpect(jsonPath("$[?(@.id == 3)].firstName").value("Juan"));
	}

	@Test
	@WithMockUser("admin")
	void shouldReturnOwner() throws Exception {
		
		when(this.ownerService.findOwnerById(TEST_OWNER_ID)).thenReturn(george);
		mockMvc.perform(get("/api/v1/owners/{id}", TEST_OWNER_ID)).andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(TEST_OWNER_ID))
				.andExpect(jsonPath("$.firstName").value(george.getFirstName()))
				.andExpect(jsonPath("$.lastName").value(george.getLastName()))
				.andExpect(jsonPath("$.plan").value(george.getPlan().toString()));
	}

	@Test
	@WithMockUser("admin")
	void shouldReturnNotFoundTutorial() throws Exception {
		
		when(this.ownerService.findOwnerById(TEST_OWNER_ID)).thenThrow(ResourceNotFoundException.class);
		mockMvc.perform(get("/api/v1/owners/{id}", TEST_OWNER_ID)).andExpect(status().isNotFound());
	}

	@Test
	@WithMockUser("admin")
	void shouldCreateOwner() throws Exception {
		
		Owner owner = new Owner();
		owner.setFirstName("Prueba");
		owner.setLastName("Prueba");
		owner.setCity("Llerena");
		owner.setAddress("Calle Reina,3");
		owner.setPlan(PricingPlan.BASIC);
		owner.setTelephone("999999999");
		owner.setUser(user);

//		.header(HttpHeaders.AUTHORIZATION, "Bearer " + adminJwt)

		mockMvc.perform(post("/api/v1/owners").with(csrf()).contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(owner))).andExpect(status().isCreated());
	}

	@Test
	@WithMockUser("admin")
	void shouldUpdateOwner() throws Exception {

		george.setFirstName("UPDATED");
		george.setLastName("UPDATED");
//		Tutorial updatedtutorial = new Tutorial(id, "Updated", "Updated", true);

		when(this.ownerService.findOwnerById(TEST_OWNER_ID)).thenReturn(george);
		when(this.ownerService.updateOwner(any(Owner.class), any(Integer.class))).thenReturn(george);

		mockMvc.perform(put("/api/v1/owners/{id}", TEST_OWNER_ID).with(csrf()).contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(george))).andExpect(status().isOk())
				.andExpect(jsonPath("$.firstName").value(george.getFirstName()))
				.andExpect(jsonPath("$.lastName").value(george.getLastName()));
	}
	
	@Test
	@WithMockUser("admin")
	void shouldReturnNotFoundUpdateOwner() throws Exception {

		george.setFirstName("UPDATED");
		george.setLastName("UPDATED");

		when(this.ownerService.findOwnerById(TEST_OWNER_ID)).thenThrow(ResourceNotFoundException.class);
		when(this.ownerService.updateOwner(any(Owner.class), any(Integer.class))).thenReturn(george);

		mockMvc.perform(put("/api/v1/owners/{id}", TEST_OWNER_ID).with(csrf()).contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(george))).andExpect(status().isNotFound());
	}
	
	@Test
	@WithMockUser("admin")
	  void shouldDeleteTutorial() throws Exception {

		when(this.ownerService.findOwnerById(TEST_OWNER_ID)).thenReturn(george);
	    doNothing().when(this.ownerService).deleteOwner(TEST_OWNER_ID);
	    mockMvc.perform(delete("/api/v1/owners/{id}", TEST_OWNER_ID).with(csrf()))
	         .andExpect(status().isOk());
	  }

//	@WithMockUser(value = "spring")
//	@Test
//	void testProcessCreationFormSuccess() throws Exception {
//		mockMvc.perform(post("/owners/new").param("firstName", "Joe").param("lastName", "Bloggs").with(csrf())
//				.param("address", "123 Caramel Street").param("city", "London").param("telephone", "01316761638"))
//				
//	}
//
//	@WithMockUser(value = "spring")
//	@Test
//	void testProcessCreationFormHasErrors() throws Exception {
//		mockMvc.perform(post("/owners/new").with(csrf()).param("firstName", "Joe").param("lastName", "Bloggs")
//				.param("city", "London")).andExpect(status().isOk()).andExpect(model().attributeHasErrors("owner"))
//				.andExpect(model().attributeHasFieldErrors("owner", "address"))
//				.andExpect(model().attributeHasFieldErrors("owner", "telephone"))
//				.andExpect(view().name("owners/createOrUpdateOwnerForm"));
//	}
//
//	@WithMockUser(value = "spring")
//	@Test
//	void testInitFindForm() throws Exception {
//		mockMvc.perform(get("/owners/find")).andExpect(status().isOk()).andExpect(model().attributeExists("owner"))
//				.andExpect(view().name("owners/findOwners"));
//	}
//
//	@WithMockUser(value = "spring")
//	@Test
//	void testProcessFindFormSuccess() throws Exception {
//		given(this.clinicService.findOwnerByLastName("")).willReturn(Lists.newArrayList(george, new Owner()));
//
//		mockMvc.perform(get("/owners")).andExpect(status().isOk()).andExpect(view().name("owners/ownersList"));
//	}
//
//	@WithMockUser(value = "spring")
//	@Test
//	void testProcessFindFormByLastName() throws Exception {
//		given(this.clinicService.findOwnerByLastName(george.getLastName())).willReturn(Lists.newArrayList(george));
//
//		mockMvc.perform(get("/owners").param("lastName", "Franklin")).andExpect(status().is3xxRedirection())
//				.andExpect(view().name("redirect:/owners/" + TEST_OWNER_ID));
//	}
//
//	@WithMockUser(value = "spring")
//	@Test
//	void testProcessFindFormNoOwnersFound() throws Exception {
//		mockMvc.perform(get("/owners").param("lastName", "Unknown Surname")).andExpect(status().isOk())
//				.andExpect(model().attributeHasFieldErrors("owner", "lastName"))
//				.andExpect(model().attributeHasFieldErrorCode("owner", "lastName", "notFound"))
//				.andExpect(view().name("owners/findOwners"));
//	}
//
//	@WithMockUser(value = "spring")
//	@Test
//	void testInitUpdateOwnerForm() throws Exception {
//		mockMvc.perform(get("/owners/{ownerId}/edit", TEST_OWNER_ID)).andExpect(status().isOk())
//				.andExpect(model().attributeExists("owner"))
//				.andExpect(model().attribute("owner", hasProperty("lastName", is("Franklin"))))
//				.andExpect(model().attribute("owner", hasProperty("firstName", is("George"))))
//				.andExpect(model().attribute("owner", hasProperty("address", is("110 W. Liberty St."))))
//				.andExpect(model().attribute("owner", hasProperty("city", is("Madison"))))
//				.andExpect(model().attribute("owner", hasProperty("telephone", is("6085551023"))))
//				.andExpect(view().name("owners/createOrUpdateOwnerForm"));
//	}
//
//	@WithMockUser(value = "spring")
//	@Test
//	void testProcessUpdateOwnerFormSuccess() throws Exception {
//		mockMvc.perform(post("/owners/{ownerId}/edit", TEST_OWNER_ID).with(csrf()).param("firstName", "Joe")
//				.param("lastName", "Bloggs").param("address", "123 Caramel Street").param("city", "London")
//				.param("telephone", "01616291589")).andExpect(status().is3xxRedirection())
//				.andExpect(view().name("redirect:/owners/{ownerId}"));
//	}
//
//	@WithMockUser(value = "spring")
//	@Test
//	void testProcessUpdateOwnerFormHasErrors() throws Exception {
//		mockMvc.perform(post("/owners/{ownerId}/edit", TEST_OWNER_ID).with(csrf()).param("firstName", "Joe")
//				.param("lastName", "Bloggs").param("city", "London")).andExpect(status().isOk())
//				.andExpect(model().attributeHasErrors("owner"))
//				.andExpect(model().attributeHasFieldErrors("owner", "address"))
//				.andExpect(model().attributeHasFieldErrors("owner", "telephone"))
//				.andExpect(view().name("owners/createOrUpdateOwnerForm"));
//	}
//
//	@WithMockUser(value = "spring")
//	@Test
//	void testShowOwner() throws Exception {
//		mockMvc.perform(get("/owners/{ownerId}", TEST_OWNER_ID)).andExpect(status().isOk())
//				.andExpect(model().attribute("owner", hasProperty("lastName", is("Franklin"))))
//				.andExpect(model().attribute("owner", hasProperty("firstName", is("George"))))
//				.andExpect(model().attribute("owner", hasProperty("address", is("110 W. Liberty St."))))
//				.andExpect(model().attribute("owner", hasProperty("city", is("Madison"))))
//				.andExpect(model().attribute("owner", hasProperty("telephone", is("6085551023"))))
//				.andExpect(view().name("owners/ownerDetails"));
//	}

}
