import { render, screen } from "../../test-utils";
import CalendarVet from "./CalendarVet";

describe('CalendarVet', () => {
    test('renders calendar correctly', async () => {
        render(<CalendarVet />);

        const headingCalendar = await screen.findByRole('heading', { 'name': /dashboard/i });
        expect(headingCalendar).toBeInTheDocument();

        const monthButton = await screen.findByRole('button', { 'name': /month/i });
        expect(monthButton).toBeInTheDocument();
    });
});