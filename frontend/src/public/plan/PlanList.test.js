import { render, screen } from "../../test-utils";
import { PlanList } from "./PlanList";


describe('PetEditOwner', () => {
    test('renders correctly', () => {
        render(<PlanList />);

        const heading = screen.getByRole('heading', { name: /pricing plans/i });
        expect(heading).toBeInTheDocument();

        const basicCard = screen.getByRole('heading', { name: /basic/i });
        expect(basicCard).toBeInTheDocument();

        const goldCard = screen.getByRole('heading', { name: /gold/i });
        expect(goldCard).toBeInTheDocument();

        const platinumCard = screen.getByRole('heading', { name: /platinum/i });
        expect(platinumCard).toBeInTheDocument();
    });

});