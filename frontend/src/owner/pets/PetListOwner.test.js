import tokenService from "../../services/token.service";
import { render, screen } from "../../test-utils";
import PetListOwner from "./PetListOwner";

describe('PetListOwner', () => {
    beforeEach(() => {
        const user = { id: 1 }
        tokenService.setUser(user);
    })

    test('renders correctly', async () => {
        render(<PetListOwner />);
        const heading = screen.getByRole('heading', { 'name': /pets/i });
        expect(heading).toBeInTheDocument();

        const addLink = screen.getByRole('link', { 'name': /Add/i });
        expect(addLink).toBeInTheDocument();
    });

    test('renders pets correctly', async () => {
        render(<PetListOwner />);
        const pet1 = await screen.findByRole('heading', { 'name': 'Leo' });
        expect(pet1).toBeInTheDocument();

        const editPetButtons = await screen.findAllByRole('link', { 'name': /edit-pet/i });
        expect(editPetButtons).toHaveLength(2);

        const editVisitButtons = await screen.findAllByRole('link', { 'name': /edit-visit/i });
        expect(editVisitButtons).toHaveLength(1);

        const deletePetButtons = await screen.findAllByRole('button', { 'name': /delete-pet/i });
        expect(deletePetButtons).toHaveLength(2);

        const cancelVisitButtons = await screen.findAllByRole('button', { 'name': /cancel-visit/i });
        expect(cancelVisitButtons).toHaveLength(1);

        const visitTables = await screen.findAllByRole('table', { 'name': /visits/ });
        expect(visitTables).toHaveLength(2);

        const pet2 = await screen.findByRole('heading', { 'name': 'Basil' });
        expect(pet2).toBeInTheDocument();
    });

    test('delete pet correct', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<PetListOwner />);

        const pet1Delete = await screen.findByRole('button', { 'name': 'delete-pet-1' });
        await user.click(pet1Delete);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });

    test('cancel visit correct', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<PetListOwner />);

        const pet1Delete = await screen.findByRole('button', { 'name': 'cancel-visit-1' });
        await user.click(pet1Delete);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });
});