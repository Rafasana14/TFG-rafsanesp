import { render, screen, waitFor } from "../../test-utils";
import { server } from "../../mocks/server";
import { rest } from "msw";
import TicketListVet from "./TicketListVet";
import tokenService from "../../services/token.service";
import { consultation1, ticket1, ticket2, userVet1 } from "../../mocks/handlers";

describe('TicketListVet', () => {

    const route = '/consultations/1/tickets'

    beforeEach(() => {
        const user = { "id": 1, "username": "vet1" }
        tokenService.setUser(user);
        server.use(
            rest.get('*/api/v1/consultations/:id/tickets', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json([
                        ticket1,
                        ticket2
                    ]),
                )
            }),
        )
    })

    test('renders correctly', async () => {
        render(<TicketListVet />, { route: route });
        const heading = screen.getByRole('heading', { 'name': /Consultation Number/ });
        expect(heading).toBeInTheDocument();

        const table = screen.getByRole('textbox', { 'name': 'Description' });
        expect(table).toBeInTheDocument();

        const saveButton = screen.getByRole('button', { 'name': 'Save' });
        expect(saveButton).toBeInTheDocument();

        const backButton = screen.getByRole('link', { 'name': /Back/ });
        expect(backButton).toBeInTheDocument();
    });

    test('renders tickets correctly', async () => {
        render(<TicketListVet />, { route: route });

        const editButtons = await screen.findAllByRole('button', { 'name': /edit/ });
        expect(editButtons).toHaveLength(1);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /delete/ });
        expect(deleteButtons).toHaveLength(1);
    });

    test('delete ticket correct', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<TicketListVet />, { route: route });

        const ticket2Delete = await screen.findByRole('button', { 'name': 'delete-2' });
        user.click(ticket2Delete);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        const editButtons = screen.queryByRole('button', { 'name': /edit/ });
        expect(editButtons).not.toBeInTheDocument();

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
                            "user": userVet1,
                            "consultation": consultation1
                        },
                    ))
            }),
        )

        const { user } = render(<TicketListVet />, { route: route });

        const input = screen.getByRole('textbox', { 'name': 'Description' });
        await user.type(input, "test ticket")
        const addButton = screen.getByRole('button', { 'name': /Save/ });
        await user.click(addButton);

        const newTicket = await screen.findByRole('heading', { 'name': /test ticket/ });
        expect(newTicket).toBeInTheDocument();
        const editButtons = await screen.findAllByRole('button', { 'name': /edit/ });
        expect(editButtons).toHaveLength(1);
    });

    test('edit ticket correct', async () => {
        server.use(
            rest.put('*/api/v1/consultations/:id/tickets/:ticketId', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            "id": 2,
                            "description": "test ticket",
                            "creationDate": "2023-01-04T17:32:00",
                            "user": userVet1,
                            "consultation": consultation1
                        },
                    ))
            }),
        )
        const { user } = render(<TicketListVet />, { route: route });

        const editButton = await screen.findByRole('button', { 'name': /edit-2/ });
        await user.click(editButton);
        const input = screen.getByRole('textbox', { 'name': 'Description' });
        await user.type(input, "test ticket")
        const addButton = screen.getByRole('button', { 'name': /Save/ });
        await user.click(addButton);

        const newTicket = await screen.findByRole('heading', { 'name': /test ticket/ });
        expect(newTicket).toBeInTheDocument();
        const editButtons = await screen.findAllByRole('button', { 'name': /edit/ });
        expect(editButtons).toHaveLength(1);
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

        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<TicketListVet />, { route: route });

        const input = screen.getByRole('textbox', { 'name': 'Description' });
        await user.type(input, "test ticket")
        const addButton = screen.getByRole('button', { 'name': /Save/ });
        await waitFor(async () => await user.click(addButton));
        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });

    test('close consultation correct', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<TicketListVet />);

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

        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<TicketListVet />);

        const closeButton = screen.getByRole('button', { 'name': /Close/ });
        await user.click(closeButton);
        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });
});