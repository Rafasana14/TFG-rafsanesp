import { render, screen, waitFor, waitForElementToBeRemoved } from "../test-utils";
import { server } from "../mocks/server";
import { rest } from "msw";
import TicketList from "./TicketList";
import tokenService from "../services/token.service";
import { ticket1, ticket2 } from "../mocks/handlers";

describe('TicketList', () => {
    test('renders correctly for admin', async () => {
        render(<TicketList auth={"ADMIN"} />);
        const heading = screen.getByRole('heading', { 'name': /Consultation Number/ });
        expect(heading).toBeInTheDocument();

        const table = screen.getByRole('textbox', { 'name': 'Description' });
        expect(table).toBeInTheDocument();

        const saveButton = screen.getByRole('button', { 'name': 'Save' });
        expect(saveButton).toBeInTheDocument();

        const closeButton = screen.getByRole('button', { 'name': /Close/ });
        expect(closeButton).toBeInTheDocument();

        const backButton = screen.getByRole('link', { 'name': /Back/ });
        expect(backButton).toBeInTheDocument();
    });

    test('renders tickets correctly for admin', async () => {
        render(<TicketList auth={"ADMIN"} />);

        const editButtons = await screen.findAllByRole('button', { 'name': /edit/ });
        expect(editButtons).toHaveLength(3);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /delete/ });
        expect(deleteButtons).toHaveLength(3)
    });

    test('renders correctly for owner', () => {
        render(<TicketList auth={"OWNER"} />);
        const heading = screen.getByRole('heading', { 'name': /Consultation Number/ });
        expect(heading).toBeInTheDocument();

        const backButton = screen.getByRole('link', { 'name': /Back/ });
        expect(backButton).toBeInTheDocument();
    });

    test('renders tickets correctly for owner', async () => {
        render(<TicketList auth={"OWNER"} />);

        const editButtons = await screen.findAllByRole('button', { 'name': /edit/ });
        expect(editButtons).toHaveLength(1);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /delete/ });
        expect(deleteButtons).toHaveLength(1);
    });

    test('renders correctly for vet', async () => {
        const route = '/consultations/1/tickets'
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
        render(<TicketList auth={"VET"} />, { route: route });
        const heading = screen.getByRole('heading', { 'name': /Consultation Number/ });
        expect(heading).toBeInTheDocument();

        const table = screen.getByRole('textbox', { 'name': 'Description' });
        expect(table).toBeInTheDocument();

        const saveButton = screen.getByRole('button', { 'name': 'Save' });
        expect(saveButton).toBeInTheDocument();

        const backButton = screen.getByRole('link', { 'name': /Back/ });
        expect(backButton).toBeInTheDocument();
    });

    test('renders tickets correctly for vet', async () => {
        const route = '/consultations/1/tickets'
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
        render(<TicketList auth={"VET"} />, { route: route });

        const editButtons = await screen.findAllByRole('button', { 'name': /edit/ });
        expect(editButtons).toHaveLength(1);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /delete/ });
        expect(deleteButtons).toHaveLength(1);
    });

    test('delete ticket correct for admin or vet', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<TicketList auth="ADMIN" />);

        const ticket2Delete = await screen.findByRole('button', { 'name': 'delete-2' });
        await user.click(ticket2Delete);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });

    test('delete ticket correct for owner', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<TicketList auth={"OWNER"} />);

        const ticket3Delete = await screen.findByRole('button', { 'name': 'delete-3' });
        await user.click(ticket3Delete);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        const editButtons = screen.queryByRole('button', { 'name': /edit/ });
        expect(editButtons).not.toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });

    test('close consultation correct for admin or vet', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<TicketList auth="ADMIN" />);

        const closeButton = screen.getByRole('button', { 'name': /Close/ });
        await user.click(closeButton);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });

    test('do not close consultation for vet with no tickets', async () => {
        const route = '/consultations/1/tickets'
        server.use(
            rest.get('*/api/v1/consultations/:id/tickets', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json([]),
                )
            }),
        )
        window.confirm = () => { return true };
        const { user } = render(<TicketList auth="VET" />, { route: route });

        const closeButton = screen.getByRole('button', { 'name': /Close/ });
        await user.click(closeButton);
        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });

    test('close consultation with exception for admin or vet', async () => {
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
        const { user } = render(<TicketList auth="ADMIN" />);

        const closeButton = screen.getByRole('button', { 'name': /Close/ });
        await user.click(closeButton);
        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });

    test('add ticket correct', async () => {
        const { user } = render(<TicketList auth="ADMIN" />);

        const input = screen.getByRole('textbox', { 'name': 'Description' });
        await user.type(input, "test ticket")
        const addButton = screen.getByRole('button', { 'name': /Save/ });
        await user.click(addButton);

        const newTicket = await screen.findByRole('heading', { 'name': /test ticket/ });
        expect(newTicket).toBeInTheDocument();
        const editButtons = await screen.findAllByRole('button', { 'name': /edit/ });
        expect(editButtons).toHaveLength(4);
    });

    test('edit ticket correct', async () => {
        const { user } = render(<TicketList auth="ADMIN" />, { route: "/consultations/1/tickets" });

        const editButton = await screen.findByRole('button', { 'name': /edit-2/ });
        await user.click(editButton);
        const input = screen.getByRole('textbox', { 'name': 'Description' });
        await user.type(input, "test ticket")
        const addButton = screen.getByRole('button', { 'name': /Save/ });
        await user.click(addButton);

        const newTicket = await screen.findByRole('heading', { 'name': /test ticket/ });
        expect(newTicket).toBeInTheDocument();
        const editButtons = await screen.findAllByRole('button', { 'name': /edit/ });
        expect(editButtons).toHaveLength(3);
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
        const { user } = render(<TicketList auth="ADMIN" />);

        const input = screen.getByRole('textbox', { 'name': 'Description' });
        await user.type(input, "test ticket")
        const addButton = screen.getByRole('button', { 'name': /Save/ });
        await waitFor(async () => await user.click(addButton));
        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });

    test('renders no form for closed consultation for owner', async () => {
        server.use(
            rest.get('*/api/v1/consultations/:id', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            id: 1,
                            status: "CLOSED",
                        },
                    )
                )
            })
        )
        render(<TicketList auth="OWNER" />);

        const input = screen.queryByRole('textbox', { 'name': 'Description' });
        expect(input).not.toBeInTheDocument();
    });

    test('fetches plan with error for owner', async () => {
        server.use(
            rest.get('*/api/v1/plan', (req, res, ctx) => {
                return res(
                    ctx.status(500),
                    ctx.json(
                        {
                            message: "Error fetching data",
                        },
                    )
                )
            })
        )
        render(<TicketList auth="OWNER" />);

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });
});