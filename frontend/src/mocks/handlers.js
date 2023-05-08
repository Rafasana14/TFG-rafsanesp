import { rest } from 'msw'

export const handlers = [
    // Handles a POST /login request
    // rest.post('/login', (req, res, ctx) => {
    //     // Persist user's authentication in the session
    //     sessionStorage.setItem('is-authenticated', 'true')
    //     return res(
    //         // Respond with a 200 status code
    //         ctx.status(200),
    //     )
    // }),
    rest.get('*/api/v1/owners', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    "id": 1,
                    "firstName": "George",
                    "lastName": "Franklin",
                    "address": "110 W. Liberty St.",
                    "city": "Sevilla",
                    "telephone": "608555103",
                    "plan": "PLATINUM",
                    "user": {
                        "id": 2,
                        "username": "owner1",
                        "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                        "authority": {
                            "id": 2,
                            "authority": "OWNER",
                            "new": false
                        },
                        "new": false
                    },
                    "new": false
                },
                {
                    "id": 2,
                    "firstName": "Betty",
                    "lastName": "Davis",
                    "address": "638 Cardinal Ave.",
                    "city": "Sevilla",
                    "telephone": "608555174",
                    "plan": "PLATINUM",
                    "user": {
                        "id": 3,
                        "username": "owner2",
                        "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                        "authority": {
                            "id": 2,
                            "authority": "OWNER",
                            "new": false
                        },
                        "new": false
                    },
                    "new": false
                },
            ]),
        )
    }),
    rest.delete('*/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                message: "Entity deleted"
            }),
        )
    }),
    rest.get('*/api/v1/pets', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    "id": 1,
                    "name": "Leo",
                    "birthDate": "2010-09-07",
                    "type": {
                        "id": 1,
                        "name": "cat",
                        "new": false
                    },
                    "owner": {
                        "id": 1,
                        "firstName": "George",
                        "lastName": "Franklin",
                        "address": "110 W. Liberty St.",
                        "city": "Sevilla",
                        "telephone": "608555103",
                        "plan": "PLATINUM",
                        "user": {
                            "id": 2,
                            "username": "owner1",
                            "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                            "authority": {
                                "id": 2,
                                "authority": "OWNER",
                                "new": false
                            },
                            "new": false
                        },
                        "new": false
                    },
                    "new": false
                },
                {
                    "id": 2,
                    "name": "Basil",
                    "birthDate": "2012-08-06",
                    "type": {
                        "id": 6,
                        "name": "hamster",
                        "new": false
                    },
                    "owner": {
                        "id": 2,
                        "firstName": "Betty",
                        "lastName": "Davis",
                        "address": "638 Cardinal Ave.",
                        "city": "Sevilla",
                        "telephone": "608555174",
                        "plan": "PLATINUM",
                        "user": {
                            "id": 3,
                            "username": "owner2",
                            "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                            "authority": {
                                "id": 2,
                                "authority": "OWNER",
                                "new": false
                            },
                            "new": false
                        },
                        "new": false
                    },
                    "new": false
                },
            ]),
        )
    }),
    rest.get('*/api/v1/users', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    "id": 1,
                    "username": "admin1",
                    "password": "$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS",
                    "authority": {
                        "id": 1,
                        "authority": "ADMIN",
                        "new": false
                    },
                    "new": false
                },
                {
                    "id": 2,
                    "username": "owner1",
                    "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                    "authority": {
                        "id": 2,
                        "authority": "OWNER",
                        "new": false
                    },
                    "new": false
                },
            ]),
        )
    }),
    rest.get('*/api/v1/vets', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    "id": 1,
                    "firstName": "James",
                    "lastName": "Carter",
                    "specialties": [],
                    "user": {
                        "id": 12,
                        "username": "vet1",
                        "password": "$2a$10$aeypcHWSf4YEkDAF0d.vjOLu94aS40MBUb4rOtDncFxZdo2wpkt8.",
                        "authority": {
                            "id": 3,
                            "authority": "VET",
                            "new": false
                        },
                        "new": false
                    },
                    "city": "Sevilla",
                    "new": false
                },
                {
                    "id": 2,
                    "firstName": "Helen",
                    "lastName": "Leary",
                    "specialties": [
                        {
                            "id": 1,
                            "name": "radiology",
                            "new": false
                        }
                    ],
                    "user": {
                        "id": 13,
                        "username": "vet2",
                        "password": "$2a$10$aeypcHWSf4YEkDAF0d.vjOLu94aS40MBUb4rOtDncFxZdo2wpkt8.",
                        "authority": {
                            "id": 3,
                            "authority": "VET",
                            "new": false
                        },
                        "new": false
                    },
                    "city": "Sevilla",
                    "new": false
                },
            ]),
        )
    }),
    rest.get('*/api/v1/vets/specialties', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    "id": 1,
                    "name": "radiology",
                    "new": false
                },
                {
                    "id": 2,
                    "name": "surgery",
                    "new": false
                },
                {
                    "id": 3,
                    "name": "dentistry",
                    "new": false
                }
            ]),
        )
    }),
    rest.get('*/api/v1/pets/:petId/visits', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    "id": 1,
                    "datetime": "2013-01-01T13:00:00",
                    "description": "rabies shot",
                    "pet": {
                        "id": 7,
                        "name": "Samantha",
                        "birthDate": "2012-09-04",
                        "type": {
                            "id": 1,
                            "name": "cat",
                            "new": false
                        },
                        "owner": {
                            "id": 6,
                            "firstName": "Jean",
                            "lastName": "Coleman",
                            "address": "105 N. Lake St.",
                            "city": "Badajoz",
                            "telephone": "608555264",
                            "plan": "BASIC",
                            "user": {
                                "id": 7,
                                "username": "owner6",
                                "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                                "authority": {
                                    "id": 2,
                                    "authority": "OWNER",
                                    "new": false
                                },
                                "new": false
                            },
                            "new": false
                        },
                        "new": false
                    },
                    "vet": {
                        "id": 4,
                        "firstName": "Rafael",
                        "lastName": "Ortega",
                        "specialties": [
                            {
                                "id": 2,
                                "name": "surgery",
                                "new": false
                            }
                        ],
                        "user": {
                            "id": 15,
                            "username": "vet4",
                            "password": "$2a$10$aeypcHWSf4YEkDAF0d.vjOLu94aS40MBUb4rOtDncFxZdo2wpkt8.",
                            "authority": {
                                "id": 3,
                                "authority": "VET",
                                "new": false
                            },
                            "new": false
                        },
                        "city": "Badajoz",
                        "new": false
                    },
                    "new": false
                },
                {
                    "id": 2,
                    "datetime": "2013-01-02T15:30:00",
                    "description": "",
                    "pet": {
                        "id": 8,
                        "name": "Max",
                        "birthDate": "2012-09-04",
                        "type": {
                            "id": 1,
                            "name": "cat",
                            "new": false
                        },
                        "owner": {
                            "id": 6,
                            "firstName": "Jean",
                            "lastName": "Coleman",
                            "address": "105 N. Lake St.",
                            "city": "Badajoz",
                            "telephone": "608555264",
                            "plan": "BASIC",
                            "user": {
                                "id": 7,
                                "username": "owner6",
                                "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                                "authority": {
                                    "id": 2,
                                    "authority": "OWNER",
                                    "new": false
                                },
                                "new": false
                            },
                            "new": false
                        },
                        "new": false
                    },
                    "vet": {
                        "id": 5,
                        "firstName": "Henry",
                        "lastName": "Stevens",
                        "specialties": [
                            {
                                "id": 1,
                                "name": "radiology",
                                "new": false
                            }
                        ],
                        "user": {
                            "id": 16,
                            "username": "vet5",
                            "password": "$2a$10$aeypcHWSf4YEkDAF0d.vjOLu94aS40MBUb4rOtDncFxZdo2wpkt8.",
                            "authority": {
                                "id": 3,
                                "authority": "VET",
                                "new": false
                            },
                            "new": false
                        },
                        "city": "Badajoz",
                        "new": false
                    },
                    "new": false
                },
            ]),
        )
    }),
    rest.get('*/api/v1/consultations', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    "id": 1,
                    "title": "Mi gato no come",
                    "status": "ANSWERED",
                    "owner": {
                        "id": 2,
                        "firstName": "Betty",
                        "lastName": "Davis",
                        "address": "638 Cardinal Ave.",
                        "city": "Sevilla",
                        "telephone": "608555174",
                        "plan": "PLATINUM",
                        "user": {
                            "id": 3,
                            "username": "owner2",
                            "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                            "authority": {
                                "id": 2,
                                "authority": "OWNER",
                                "new": false
                            },
                            "new": false
                        },
                        "new": false
                    },
                    "pet": {
                        "id": 2,
                        "name": "Basil",
                        "birthDate": "2012-08-06",
                        "type": {
                            "id": 6,
                            "name": "hamster",
                            "new": false
                        },
                        "owner": {
                            "id": 2,
                            "firstName": "Betty",
                            "lastName": "Davis",
                            "address": "638 Cardinal Ave.",
                            "city": "Sevilla",
                            "telephone": "608555174",
                            "plan": "PLATINUM",
                            "user": {
                                "id": 3,
                                "username": "owner2",
                                "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                                "authority": {
                                    "id": 2,
                                    "authority": "OWNER",
                                    "new": false
                                },
                                "new": false
                            },
                            "new": false
                        },
                        "new": false
                    },
                    "creationDate": "2023-04-11T11:20:00",
                    "new": false
                },
                {
                    "id": 2,
                    "title": "Título 2",
                    "status": "PENDING",
                    "owner": {
                        "id": 2,
                        "firstName": "Betty",
                        "lastName": "Davis",
                        "address": "638 Cardinal Ave.",
                        "city": "Sevilla",
                        "telephone": "608555174",
                        "plan": "PLATINUM",
                        "user": {
                            "id": 3,
                            "username": "owner1",
                            "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                            "authority": {
                                "id": 2,
                                "authority": "OWNER",
                                "new": false
                            },
                            "new": false
                        },
                        "new": false
                    },
                    "pet": {
                        "id": 2,
                        "name": "Basil",
                        "birthDate": "2012-08-06",
                        "type": {
                            "id": 6,
                            "name": "hamster",
                            "new": false
                        },
                        "owner": {
                            "id": 2,
                            "firstName": "Betty",
                            "lastName": "Davis",
                            "address": "638 Cardinal Ave.",
                            "city": "Sevilla",
                            "telephone": "608555174",
                            "plan": "PLATINUM",
                            "user": {
                                "id": 3,
                                "username": "owner1",
                                "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                                "authority": {
                                    "id": 2,
                                    "authority": "OWNER",
                                    "new": false
                                },
                                "new": false
                            },
                            "new": false
                        },
                        "new": false
                    },
                    "creationDate": "2023-04-11T11:20:00",
                    "new": false
                },
            ]),
        )
    }),
    rest.get('*/api/v1/consultations/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    "id": 1,
                    "title": "Consultation about vaccines",
                    "status": "ANSWERED",
                    "owner": {
                        "id": 1,
                        "firstName": "George",
                        "lastName": "Franklin",
                        "address": "110 W. Liberty St.",
                        "city": "Sevilla",
                        "telephone": "608555103",
                        "plan": "PLATINUM",
                        "user": {
                            "id": 2,
                            "username": "owner1",
                            "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                            "authority": {
                                "id": 2,
                                "authority": "OWNER",
                                "new": false
                            },
                            "new": false
                        },
                        "new": false
                    },
                    "pet": {
                        "id": 1,
                        "name": "Leo",
                        "birthDate": "2010-09-07",
                        "type": {
                            "id": 1,
                            "name": "cat",
                            "new": false
                        },
                        "owner": {
                            "id": 1,
                            "firstName": "George",
                            "lastName": "Franklin",
                            "address": "110 W. Liberty St.",
                            "city": "Sevilla",
                            "telephone": "608555103",
                            "plan": "PLATINUM",
                            "user": {
                                "id": 2,
                                "username": "owner1",
                                "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                                "authority": {
                                    "id": 2,
                                    "authority": "OWNER",
                                    "new": false
                                },
                                "new": false
                            },
                            "new": false
                        },
                        "new": false
                    },
                    "creationDate": "2023-01-04T17:30:00",
                    "new": false
                },
            ]),
        )
    }),
    rest.get('*/api/v1/consultations/:id/tickets', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    "id": 1,
                    "description": "What vaccine should my dog recieve?",
                    "creationDate": "2023-01-04T17:32:00",
                    "user": {
                        "id": 2,
                        "username": "owner1",
                        "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                        "authority": {
                            "id": 2,
                            "authority": "OWNER",
                            "new": false
                        },
                        "new": false
                    },
                    "consultation": {
                        "id": 1,
                        "title": "Consultation about vaccines",
                        "status": "ANSWERED",
                        "owner": {
                            "id": 1,
                            "firstName": "George",
                            "lastName": "Franklin",
                            "address": "110 W. Liberty St.",
                            "city": "Sevilla",
                            "telephone": "608555103",
                            "plan": "PLATINUM",
                            "user": {
                                "id": 2,
                                "username": "owner1",
                                "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                                "authority": {
                                    "id": 2,
                                    "authority": "OWNER",
                                    "new": false
                                },
                                "new": false
                            },
                            "new": false
                        },
                        "pet": {
                            "id": 1,
                            "name": "Leo",
                            "birthDate": "2010-09-07",
                            "type": {
                                "id": 1,
                                "name": "cat",
                                "new": false
                            },
                            "owner": {
                                "id": 1,
                                "firstName": "George",
                                "lastName": "Franklin",
                                "address": "110 W. Liberty St.",
                                "city": "Sevilla",
                                "telephone": "608555103",
                                "plan": "PLATINUM",
                                "user": {
                                    "id": 2,
                                    "username": "owner1",
                                    "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                                    "authority": {
                                        "id": 2,
                                        "authority": "OWNER",
                                        "new": false
                                    },
                                    "new": false
                                },
                                "new": false
                            },
                            "new": false
                        },
                        "creationDate": "2023-01-04T17:30:00",
                        "new": false
                    },
                    "new": false
                },
                {
                    "id": 2,
                    "description": "Rabies' one.",
                    "creationDate": "2023-01-04T17:36:00",
                    "user": {
                        "id": 12,
                        "username": "vet1",
                        "password": "$2a$10$aeypcHWSf4YEkDAF0d.vjOLu94aS40MBUb4rOtDncFxZdo2wpkt8.",
                        "authority": {
                            "id": 3,
                            "authority": "VET",
                            "new": false
                        },
                        "new": false
                    },
                    "consultation": {
                        "id": 1,
                        "title": "Consultation about vaccines",
                        "status": "ANSWERED",
                        "owner": {
                            "id": 1,
                            "firstName": "George",
                            "lastName": "Franklin",
                            "address": "110 W. Liberty St.",
                            "city": "Sevilla",
                            "telephone": "608555103",
                            "plan": "PLATINUM",
                            "user": {
                                "id": 2,
                                "username": "owner1",
                                "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                                "authority": {
                                    "id": 2,
                                    "authority": "OWNER",
                                    "new": false
                                },
                                "new": false
                            },
                            "new": false
                        },
                        "pet": {
                            "id": 1,
                            "name": "Leo",
                            "birthDate": "2010-09-07",
                            "type": {
                                "id": 1,
                                "name": "cat",
                                "new": false
                            },
                            "owner": {
                                "id": 1,
                                "firstName": "George",
                                "lastName": "Franklin",
                                "address": "110 W. Liberty St.",
                                "city": "Sevilla",
                                "telephone": "608555103",
                                "plan": "PLATINUM",
                                "user": {
                                    "id": 2,
                                    "username": "owner1",
                                    "password": "$2a$10$DaS6KIEfF5CRTFrxIoGc7emY3BpZZ0.fVjwA3NiJ.BjpGNmocaS3e",
                                    "authority": {
                                        "id": 2,
                                        "authority": "OWNER",
                                        "new": false
                                    },
                                    "new": false
                                },
                                "new": false
                            },
                            "new": false
                        },
                        "creationDate": "2023-01-04T17:30:00",
                        "new": false
                    },
                    "new": false
                }
            ]),
        )
    }),

]