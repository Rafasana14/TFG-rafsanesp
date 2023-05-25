import { render, screen } from "../../test-utils";
import StatsAdmin from "./StatsAdmin";

describe('StatsAdmin', () => {
    test('renders correctly', async () => {
        render(<StatsAdmin />);

        const headingStats = await screen.findAllByRole('heading', { 'name': /stats/i });
        expect(headingStats).toHaveLength(5);

        const statsTables = await screen.findAllByRole('table', { 'name': /stats/i });
        expect(statsTables).toHaveLength(4);
    });

});