import { act, render, screen, waitFor } from "../../test-utils";
import { server } from "../../mocks/server";
import { rest } from "msw";
import TicketListOwner from "./TicketListOwner";

describe('TicketListOwner', () => {
    test('renders correctly', () => {
        render(<TicketListOwner />);
        const heading = screen.getByRole('heading', { 'name': /Consultation Number/ });
        expect(heading).toBeInTheDocument();

        const backButton = screen.getByRole('link', { 'name': /Back/ });
        expect(backButton).toBeInTheDocument();
    });

    test('renders tickets correctly', async () => {
        render(<TicketListOwner />);

        const editButtons = await screen.findAllByRole('button', { 'name': /edit/ });
        expect(editButtons).toHaveLength(1);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /delete/ });
        expect(deleteButtons).toHaveLength(1);
    });

    test('delete ticket correct', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<TicketListOwner />);

        const ticket3Delete = await screen.findByRole('button', { 'name': 'delete-3' });
        await act(async () => await user.click(ticket3Delete));
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        const editButtons = screen.queryByRole('button', { 'name': /edit/ });
        expect(editButtons).not.toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });


    test('add ticket correct', async () => {
        const { user } = render(<TicketListOwner />);

        const input = await screen.findByRole('textbox', { 'name': 'Description' });
        await user.type(input, "test ticket")
        const addButton = await screen.findByRole('button', { 'name': /Save/ });
        await user.click(addButton);

        const newTicket = await screen.findByRole('heading', { 'name': /test ticket/ });
        expect(newTicket).toBeInTheDocument();
        const editButtons = await screen.findAllByRole('button', { 'name': /edit/ });
        expect(editButtons).toHaveLength(1);
    });

    test('edit ticket correct', async () => {
        const { user } = render(<TicketListOwner />, { route: "/consultations/1/tickets" });

        const editButton = await screen.findByRole('button', { 'name': /edit-3/ });
        await user.click(editButton);
        const input = await screen.findByRole('textbox', { 'name': 'Description' });
        await user.type(input, "test ticket")
        const addButton = await screen.findByRole('button', { 'name': /Save/ });
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
        const { user } = render(<TicketListOwner />);

        const input = await screen.findByRole('textbox', { 'name': 'Description' });
        await user.type(input, "test ticket")
        const addButton = await screen.findByRole('button', { 'name': /Save/ });
        await waitFor(async () => await user.click(addButton));
        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });
});