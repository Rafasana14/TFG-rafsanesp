import { render, screen } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import TicketListAdmin from "./TicketListAdmin";
import { server } from "../../mocks/server";
import { rest } from "msw";

describe('TicketListAdmin', () => {
    test('renders correctly', async () => {

        render(<TicketListAdmin />);
        const heading = screen.getByRole('heading', { 'name': /Consultation Number/ });
        expect(heading).toBeInTheDocument();

        const table = screen.getByRole('textbox', { 'name': 'Description' });
        expect(table).toBeInTheDocument();

        const saveButton = screen.getByRole('button', { 'name': 'Save' });
        expect(saveButton).toBeInTheDocument();

        const closeButton = screen.getByRole('button', { 'name': /Close/ });
        expect(closeButton).toBeInTheDocument();

        const addLink = screen.getByRole('button', { 'name': 'Close Consultation' });
        expect(addLink).toBeInTheDocument();
    });

    test('renders tickets correctly', async () => {
        render(<TicketListAdmin />);

        const editButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(editButtons).toHaveLength(2);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /delete/ });
        expect(deleteButtons).toHaveLength(2)
    });

    test('delete ticket correct', async () => {
        const user = userEvent.setup();
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        render(<TicketListAdmin />);

        const ticket2Delete = await screen.findByRole('button', { 'name': 'delete-2' });
        await user.click(ticket2Delete);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });

    test('close consultation correct', async () => {
        server.use(
            rest.put('*/api/v1/consultations/:id', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            "id": 1,
                            "title": "Consulta sobre vacunas",
                            "status": "CLOSED",
                            "owner": {
                                "id": 1,
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
                                "owner": {
                                    "id": 1,
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
                    )
                )
            })
        )

        const user = userEvent.setup();
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        render(<TicketListAdmin />);

        const closeButton = screen.getByRole('button', { 'name': /Close/ });
        await user.click(closeButton);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });

    test('close consultation with exception', async () => {
        server.use(
            rest.put('*/api/v1/consultations/:id', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            "statusCode": 500,
                            "message": "Error while closing the consultation.",
                        },
                    )
                )
            })
        )

        const user = userEvent.setup();
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        render(<TicketListAdmin />);

        const closeButton = screen.getByRole('button', { 'name': /Close/ });
        await user.click(closeButton);
        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });

    test('add ticket correct', async () => {
        server.use(
            rest.post('*/api/v1/consultations/:id/tickets', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            "id": 3,
                            "description": "test ticket",
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
                    )
                )
            })
        )

        const user = userEvent.setup();
        render(<TicketListAdmin />);

        const input = screen.getByRole('textbox', { 'name': 'Description' });
        await user.type(input, "test ticket")
        const addButton = screen.getByRole('button', { 'name': /Save/ });
        await user.click(addButton);

        const editButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(editButtons).toHaveLength(3);

        const newTicket = await screen.findByRole('heading', { 'name': /test ticket/ });
        expect(newTicket).toBeInTheDocument();
    });

    test('add ticket with exception', async () => {
        server.use(
            rest.post('*/api/v1/consultations/:id/tickets', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            "statusCode": 500,
                            "message": "Error while adding the ticket.",
                        },
                    )
                )
            })
        )

        const user = userEvent.setup();
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        render(<TicketListAdmin />);

        const input = screen.getByRole('textbox', { 'name': 'Description' });
        await user.type(input, "test ticket")
        const addButton = screen.getByRole('button', { 'name': /Save/ });
        await user.click(addButton);
        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });
});