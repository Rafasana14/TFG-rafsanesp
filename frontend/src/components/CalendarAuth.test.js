
import { render, screen } from "../test-utils";
import CalendarAuth from "./CalendarAuth";

describe('CalendarAuth', () => {
    test('renders calendar correctly for vets', async () => {
        render(<CalendarAuth auth={"VET"} />);

        const headingCalendar = await screen.findByRole('heading', { 'name': /visits calendar/i });
        expect(headingCalendar).toBeInTheDocument();

        const monthButton = await screen.findByRole('button', { 'name': /month/i });
        expect(monthButton).toBeInTheDocument();
    });

    test('renders calendar correctly for owners', async () => {
        render(<CalendarAuth />);

        const headingCalendar = await screen.findByRole('heading', { 'name': /visits calendar/i });
        expect(headingCalendar).toBeInTheDocument();

        const monthButton = await screen.findByRole('button', { 'name': /month/i });
        expect(monthButton).toBeInTheDocument();
    });
});