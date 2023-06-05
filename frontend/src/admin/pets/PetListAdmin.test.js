import { render, screen, testRenderList } from "../../test-utils";
import PetListAdmin from "./PetListAdmin";

describe('PetListAdmin', () => {
    test('renders correctly', async () => {
        render(<PetListAdmin test={true} />);
        testRenderList(/pets/i, true);
    });

    test('renders correctly for vets', async () => {
        render(<PetListAdmin test={true} admin={false} />);
        testRenderList(/pets/i, true, false);

        const detailsButtons = await screen.findAllByRole('link', { 'name': /details/ });
        expect(detailsButtons).toHaveLength(2);
    });

    test('renders pets correctly', async () => {
        render(<PetListAdmin test={true} />);
        const pet1 = await screen.findByRole('cell', { 'name': 'Leo' });
        expect(pet1).toBeInTheDocument();

        const editButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(editButtons).toHaveLength(2);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /delete/ });
        expect(deleteButtons).toHaveLength(2);

        const visitLinks = await screen.findAllByRole('link', { 'name': /visits/ });
        expect(visitLinks).toHaveLength(2);

        const pet2 = await screen.findByRole('cell', { 'name': 'Basil' });
        expect(pet2).toBeInTheDocument();

        const pets = await screen.findAllByRole('row', {},);
        expect(pets).toHaveLength(3);
    });

    test('delete pet correct', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<PetListAdmin test={true} />);

        const pet1Delete = await screen.findByRole('button', { 'name': /delete-1/i });
        await user.click(pet1Delete);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });
});