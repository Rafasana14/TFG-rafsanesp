package org.springframework.samples.petclinic.vet;

/**
 * Test class for the {@link VetController}
 */
//@WebMvcTest(controllers = VetController.class, excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = WebSecurityConfigurer.class), excludeAutoConfiguration = SecurityConfiguration.class)
//class VetControllerTests {
//
//	@SuppressWarnings("unused")
//	@Autowired
//	private VetController vetController;
//
//	@MockBean
//	private VetService clinicService;
//
//	@SuppressWarnings("unused")
//	@Autowired
//	private MockMvc mockMvc;
//
//	@BeforeEach
//	void setup() {
//
//		Vet james = new Vet();
//		james.setFirstName("James");
//		james.setLastName("Carter");
//		james.setId(1);
//		Vet helen = new Vet();
//		helen.setFirstName("Helen");
//		helen.setLastName("Leary");
//		helen.setId(2);
//		Specialty radiology = new Specialty();
//		radiology.setId(1);
//		radiology.setName("radiology");
//		helen.addSpecialty(radiology);
//		given(this.clinicService.findVets()).willReturn(Lists.newArrayList(james, helen));
//	}
//
//	@WithMockUser(value = "spring")
//	@Test
//	void testShowVetListHtml() throws Exception {
//		mockMvc.perform(get("/vets")).andExpect(status().isOk()).andExpect(model().attributeExists("vets"))
//				.andExpect(view().name("vets/vetList"));
//	}
//
//	@WithMockUser(value = "spring")
//	@Test
//	void testShowVetListXml() throws Exception {
//		mockMvc.perform(get("/vets.xml").accept(MediaType.APPLICATION_XML)).andExpect(status().isOk())
//				.andExpect(content().contentType(MediaType.APPLICATION_XML_VALUE))
//				.andExpect(content().node(hasXPath("/vets/vetList[id=1]/id")));
//	}
//
//}
