import { fireEvent, render, screen } from "../../test-utils";
import { server } from "../../mocks/server";
import { rest } from "msw";
import DashboardOwner from "./DashboardOwner";

describe('DashboardOwner', () => {
    test('renders calendar correctly', async () => {
        render(<DashboardOwner />);
        const heading = screen.getByRole('heading', { 'name': /dashboard/i });
        expect(heading).toBeInTheDocument();

        const statsButton = await screen.findByRole('button', { 'name': /stats/i });
        expect(statsButton).toBeInTheDocument();

        const calendarButton = await screen.findByRole('button', { 'name': /calendar/i });
        expect(calendarButton).toBeInTheDocument();

        const headingCalendar = await screen.findByRole('heading', { 'name': /calendar/i });
        expect(headingCalendar).toBeInTheDocument();
    });

    test('renders stats correctly', async () => {
        render(<DashboardOwner />);

        const statsButton = await screen.findByRole('button', { 'name': /show-stats/i });
        expect(statsButton).toBeInTheDocument();
        fireEvent.click(statsButton);

        const headingStats = await screen.findAllByRole('heading', { 'name': /stats/i });
        expect(headingStats).toHaveLength(3);
    });

    test('renders calendar after stats correctly', async () => {
        render(<DashboardOwner />);

        const statsButton = await screen.findByRole('button', { 'name': /show-stats/i });
        expect(statsButton).toBeInTheDocument();
        fireEvent.click(statsButton);

        const headingStats = await screen.findAllByRole('heading', { 'name': /stats/i });
        expect(headingStats).toHaveLength(3);

        const calendarButton = screen.getByRole('button', { 'name': /show-calendar/i });
        expect(calendarButton).toBeInTheDocument();
        fireEvent.click(calendarButton);

        const headingCalendar = await screen.findByRole('heading', { 'name': /calendar/i });
        expect(headingCalendar).toBeInTheDocument();
    });

    test('only renders calendar for GOLD users', async () => {
        server.use(
            rest.get('*/api/v1/plan', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            "plan": "GOLD",
                        },
                    )
                )
            })
        )
        render(<DashboardOwner />);

        const headingCalendar = await screen.findByRole('heading', { 'name': /calendar/i });
        expect(headingCalendar).toBeInTheDocument();

        const statsButton = screen.queryByRole('button', { 'name': /show-stats/i });
        expect(statsButton).not.toBeInTheDocument();

        const calendarButton = screen.queryByRole('button', { 'name': /show-calendar/i });
        expect(calendarButton).not.toBeInTheDocument();
    });

    test('renders for BASIC user', async () => {
        server.use(
            rest.post('*/api/v1/consultations/:id/tickets', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            "plan": "BASIC",
                        },
                    )
                )
            })
        )
        render(<DashboardOwner />);


        const headingCalendar = await screen.findByRole('heading', { 'name': /This is only for GOLD or PLATINUM users/i });
        expect(headingCalendar).toBeInTheDocument();
    });
});