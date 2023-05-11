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
    "id": 2,
    "username": "owner1",
    "authority": authOwner
};

const userOwner2 = {
    "id": 3,
    "username": "owner2",
    "authority": authOwner
};

const userVet1 = {
    "id": 12,
    "username": "vet1",
    "authority": {
        "authority": "VET"
    }
};

const userVet2 = {
    "id": 13,
    "username": "vet2",
    "authority": {
        "authority": "VET"
    }
};

const owner1 = {
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

const vet1 = {
    "id": 1,
    "firstName": "James",
    "lastName": "Carter",
    "specialties": [],
    "user": userVet1,
    "city": "Sevilla"
}

const vet2 = {
    "id": 2,
    "firstName": "Helen",
    "lastName": "Leary",
    "specialties": [
        {
            "id": 1,
            "name": "radiology"
        }
    ],
    "user": userVet2,
    "city": "Sevilla"
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

const visit1 = {
    "id": 1,
    "datetime": "2013-01-01T13:00:00",
    "description": "rabies shot",
    "pet": pet1,
    "vet": vet1,
    "city": "Badajoz",
};

const visit2 = {
    "id": 2,
    "datetime": "2013-01-02T15:30:00",
    "description": "",
    "pet": pet1,
    "vet": vet2
};

const consultation1 = {
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

const ticket1 = {
    "id": 1,
    "description": "What vaccine should my dog recieve?",
    "creationDate": "2023-01-04T17:32:00",
    "user": userOwner1,
    "consultation": consultation1
};

const ticket2 = {
    "id": 2,
    "description": "Rabies' one.",
    "creationDate": "2023-01-04T17:36:00",
    "user": userVet1,
    "consultation": consultation1
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

    rest.get('*/api/v1/owners', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                owner1,
                owner2,
            ]),
        )
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

    rest.post('*/api/v1/vets', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(vet1),
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

    rest.get('*/api/v1/vets/:id', (req, res, ctx) => {
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
                ticket2
            ]),
        )
    }),

    rest.post('*/api/v1/consultations/:id/tickets', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                {
                    "id": 3,
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

]