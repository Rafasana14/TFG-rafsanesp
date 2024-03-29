import { fireEvent, render, screen, waitForElementToBeRemoved } from "../../test-utils";
import { server } from "../../mocks/server";
import { rest } from "msw";
import DashboardOwner from "./DashboardOwner";
import { owner1 } from "../../mocks/handlers";

describe('DashboardOwner', () => {
    test('renders calendar correctly', async () => {
        render(<DashboardOwner />);

        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));

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
        const jsdomAlert = window.alert;
        window.alert = () => { return true };
        render(<DashboardOwner />);

        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));

        const statsButton = await screen.findByRole('button', { 'name': /show-stats/i });
        expect(statsButton).toBeInTheDocument();
        fireEvent.click(statsButton);

        const headingStats = await screen.findAllByRole('heading', { 'name': /stats/i });
        expect(headingStats).toHaveLength(3);

        const barGraphs = await screen.findAllByRole('img', { name: /bar/i });
        expect(barGraphs).toHaveLength(2);
        const pieGraphs = await screen.findAllByRole('img', { name: /pie/i });
        expect(pieGraphs).toHaveLength(2);

        window.confirm = jsdomAlert;
    });

    test('renders calendar after stats correctly', async () => {
        render(<DashboardOwner />);

        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));

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
                        { ...owner1, plan: "GOLD" }
                    )
                )
            })
        )
        render(<DashboardOwner />);

        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));

        const headingCalendar = await screen.findByRole('heading', { 'name': /calendar/i });
        expect(headingCalendar).toBeInTheDocument();

        const statsButton = screen.queryByRole('button', { 'name': /show-stats/i });
        expect(statsButton).not.toBeInTheDocument();

        const calendarButton = screen.queryByRole('button', { 'name': /show-calendar/i });
        expect(calendarButton).not.toBeInTheDocument();
    });

    test('renders for BASIC user', async () => {
        server.use(
            rest.get('*/api/v1/plan', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        { ...owner1, plan: "BASIC" }
                    )
                )
            })
        )
        render(<DashboardOwner />);

        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();

        const statsButton = screen.getByRole('button', { 'name': /show-stats/i });
        expect(statsButton).toBeInTheDocument();

        const headingCalendar = screen.getByRole('heading', { 'name': /calendar/i });
        expect(headingCalendar).toBeInTheDocument();
    });
});