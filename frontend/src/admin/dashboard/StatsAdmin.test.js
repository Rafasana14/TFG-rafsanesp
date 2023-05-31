import { render, screen } from "../../test-utils";
import StatsAdmin from './StatsAdmin';

describe('StatsAdmin', () => {
    test('renders correctly', async () => {
        render(<StatsAdmin />);

        const headingStats = await screen.findAllByRole('heading', { 'name': /stats/i });
        expect(headingStats).toHaveLength(5);

        const statsTables = await screen.findAllByRole('table', { 'name': /stats/i });
        expect(statsTables).toHaveLength(4);

        const barGraphs = await screen.findAllByRole('img', { name: /bar/i });
        expect(barGraphs).toHaveLength(4);
        const pieGraphs = await screen.findAllByRole('img', { name: /pie/i });
        expect(pieGraphs).toHaveLength(2);
    });

});