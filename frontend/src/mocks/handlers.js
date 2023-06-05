import { rest } from 'msw'

const authAdmin = {
    "id": 1,
    "authority": "ADMIN"
};

const authOwner = {
    "id": 2,
    "authority": "OWNER"
};

const userAdmin1 = {
    "id": 1,
    "username": "admin1",
    "authority": authAdmin
};

const userOwner1 = {
    id: 2,
    username: "owner1",
    authority: authOwner
};

const userOwner2 = {
    id: 3,
    username: "owner2",
    authority: authOwner
};

export const userVet1 = {
    id: 12,
    username: "vet1",
    authority: {
        authority: "VET"
    }
};

const userVet2 = {
    "id": 13,
    "username": "vet2",
    "authority": {
        "authority": "VET"
    }
};

export const owner1 = {
    "id": 1,
    "firstName": "George",
    "lastName": "Franklin",
    "address": "110 W. Liberty St.",
    "city": "Sevilla",
    "telephone": "608555103",
    "plan": "PLATINUM",
    "user": userOwner1
};

const owner2 = {
    "id": 2,
    "firstName": "Betty",
    "lastName": "Davis",
    "address": "638 Cardinal Ave.",
    "city": "Sevilla",
    "telephone": "608555174",
    "plan": "PLATINUM",
    "user": userOwner2
};

const cat = {
    "id": 1,
    "name": "cat"
};

const dog = {
    "id": 2,
    "name": "dog"
};

const pet1 = {
    "id": 1,
    "name": "Leo",
    "birthDate": "2010-09-07",
    "type": cat,
    "owner": owner1
};

const pet2 = {
    "id": 2,
    "name": "Basil",
    "birthDate": "2012-08-06",
    "type": dog,
    "owner": owner2
};

const radiology = {
    "id": 1,
    "name": "radiology"
};

const surgery = {
    "id": 2,
    "name": "surgery"
};

const dentistry = {
    "id": 3,
    "name": "dentistry"
};

const vet1 = {
    id: 1,
    firstName: "James",
    lastName: "Carter",
    specialties: [radiology],
    user: userVet1,
    city: "Sevilla"
}

const vet2 = {
    "id": 2,
    "firstName": "Helen",
    "lastName": "Leary",
    "specialties": [
        radiology
    ],
    "user": userVet2,
    "city": "Badajoz"
};

const visit1 = {
    id: 1,
    datetime: "2030-01-01T13:00:00",
    description: "description1",
    pet: pet1,
    vet: vet1,
    city: "Badajoz",
};

const visit2 = {
    "id": 2,
    "datetime": "2013-01-02T15:30:00",
    "description": "",
    "pet": pet1,
    "vet": vet2
};

export const consultation1 = {
    "id": 1,
    "title": "Mi gato no come",
    "status": "ANSWERED",
    "pet": pet1,
    "creationDate": "2023-04-11T11:20:00"
};

const consultation2 = {
    "id": 2,
    "title": "Título 2",
    "status": "PENDING",
    "pet": pet2,
    "creationDate": "2023-04-11T11:20:00"
};

export const ticket1 = {
    "id": 1,
    "description": "What vaccine should my dog recieve?",
    "creationDate": "2023-01-04T17:32:00",
    "user": userOwner1,
    "consultation": consultation1
};

export const ticket2 = {
    "id": 2,
    "description": "Rabies' one.",
    "creationDate": "2023-01-04T17:36:00",
    "user": userVet1,
    "consultation": consultation1
}

const ticket3 = {
    "id": 3,
    "description": "Thank you",
    "creationDate": "2023-01-04T17:36:00",
    "user": userOwner1,
    "consultation": consultation1
}

const request = {
    "token": "token",
    "id": 1,
    "username": "username",
    "roles": "VET"
}

export const handlers = [
    rest.delete('*/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                message: "Entity deleted"
            }),
        )
    }),

    rest.get('*/api/v1/plan', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(owner1),
        )
    }),

    rest.put('*/api/v1/plan', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({ ...owner1, plan: "GOLD" }),
        )
    }),

    rest.get('*/api/v1/owners', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                owner1,
                owner2,
            ]),
        )
    }),

    rest.get('*/api/v1/owners/stats', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                {
                    "ownersByPlan": {
                        "BASIC": 4,
                        "GOLD": 3,
                        "PLATINUM": 3
                    },
                    "totalOwners": 10,
                    "moreThanOnePet": 3
                }
            ))
    }),

    rest.get('*/api/v1/owners/profile', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                owner1
            ))
    }),

    rest.put('*/api/v1/owners/profile', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                owner1
            ))
    }),

    rest.get('*/api/v1/owners/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                owner1
            ),
        )
    }),

    rest.post('*/api/v1/owners', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                owner1
            ),
        )
    }),

    rest.put('*/api/v1/owners/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                owner1
            ),
        )
    }),

    rest.get('*/api/v1/pets', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                pet1,
                pet2,
            ]),
        )
    }),

    rest.post('*/api/v1/pets', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(pet1),
        )
    }),

    rest.get('*/api/v1/pets/types', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                cat,
                dog
            ]),
        )
    }),

    rest.get('*/api/v1/pets/stats', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                {
                    "petsByType": {
                        "hamster": 1,
                        "cat": 4,
                        "bird": 2,
                        "snake": 1,
                        "dog": 4,
                        "lizard": 1
                    },
                    "avgPetsPerOwner": 1.3,
                    "totalPets": 13
                }
            ))
    }),

    rest.get('/api/v1/pets/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(pet1),
        )
    }),

    rest.put('*/api/v1/pets/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(pet1),
        )
    }),

    rest.get('*/api/v1/users', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                userAdmin1,
                userOwner1,
            ]),
        )
    }),

    rest.post('*/api/v1/users', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(userAdmin1),
        )
    }),

    rest.get('*/api/v1/users/authorities', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                authAdmin,
                authOwner
            ]),
        )
    }),

    rest.get('*/api/v1/users/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(userAdmin1),
        )
    }),

    rest.put('*/api/v1/users/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(userAdmin1),
        )
    }),

    rest.get('*/api/v1/vets', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                vet1,
                vet2,
            ]),
        )
    }),

    rest.get('*/api/v1/vets/specialties', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                radiology, surgery, dentistry
            ]),
        )
    }),


    rest.post('*/api/v1/vets/specialties', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(radiology),
        )
    }),

    rest.get('*/api/v1/vets/profile', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(vet1),
        )
    }),


    rest.put('*/api/v1/vets/profile', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(vet1),
        )
    }),

    rest.get('*/api/v1/vets/stats', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                {
                    "vetsBySpecialty": {
                        "dentistry": 1,
                        "radiology": 2,
                        "surgery": 2
                    },
                    "vetsByCity": {
                        "Cádiz": 1,
                        "Sevilla": 3,
                        "Badajoz": 2
                    },
                    "totalVets": 6,
                    "visitsByVet": {
                        "James Carter": 3,
                        "Rafael Ortega": 2,
                        "Henry Stevens": 2,
                        "Linda Douglas": 1,
                        "Helen Leary": 1
                    }
                }
            ))
    }),

    rest.get('*/api/v1/vets/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(vet1),
        )
    }),

    rest.post('*/api/v1/vets', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(vet1),
        )
    }),

    rest.put('*/api/v1/vets/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(vet1),
        )
    }),

    rest.get('*/api/v1/vets/specialties/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(radiology),
        )
    }),

    rest.put('*/api/v1/vets/specialties/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(radiology),
        )
    }),

    rest.get('*/api/v1/visits', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                visit1,
                visit2
            ]),
        )
    }),

    rest.get('*/api/v1/visits/stats', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                {
                    "avgVisitsPerPet": 0.64,
                    "totalVisits": 9,
                    "visitsByYear": {
                        "2020": 2,
                        "2013": 7
                    },
                    "visitsByPet": {
                        "Leo": 2,
                        "Messi": 7
                    }
                }
            ))
    }),

    rest.get('*/api/v1/pets/:petId/visits', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                visit1,
                visit2,
            ]),
        )
    }),

    rest.post('*/api/v1/pets/:petId/visits', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(visit1),
        )
    }),

    rest.get('*/api/v1/pets/:petId/visits/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(visit1),
        )
    }),

    rest.put('*/api/v1/pets/:petId/visits/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(visit1),
        )
    }),

    rest.get('*/api/v1/consultations', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                consultation1,
                consultation2,
            ]),
        )
    }),

    rest.post('*/api/v1/consultations', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(consultation1),
        )
    }),

    rest.get('*/api/v1/consultations/stats', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                {
                    "totalConsultations": 5,
                    "avgConsultationsPerPlatinumOwner": 1.6666666666666667,
                    "avgConsultationsPerOwner": 0.5,
                    "consultationsByYear": {
                        "2020": 1
                    },
                    "consultationsByPet": {
                        "Leo": 1
                    },
                }
            ))
    }),

    rest.get('*/api/v1/consultations/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(consultation1),
        )
    }),

    rest.put('*/api/v1/consultations/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(consultation1),
        )
    }),

    rest.get('*/api/v1/consultations/:id/tickets', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                ticket1,
                ticket2,
                ticket3
            ]),
        )
    }),

    rest.post('*/api/v1/consultations/:id/tickets', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                {
                    "id": 4,
                    "description": "test ticket",
                    "creationDate": "2023-01-04T17:32:00",
                    "user": userOwner1,
                    "consultation": consultation1
                },
            ))
    }),

    rest.put('*/api/v1/consultations/:id/tickets/:ticketId', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                {
                    "id": 2,
                    "description": "test ticket",
                    "creationDate": "2023-01-04T17:32:00",
                    "user": userOwner1,
                    "consultation": consultation1
                },
            ))
    }),

    rest.post('*/api/v1/auth/signup', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                request
            ))
    }),

    rest.post('*/api/v1/auth/signin', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                request
            ))
    }),

]