import { render, screen, testRenderList } from "../../test-utils";
import VetListAdmin from "./VetListAdmin";

describe('VetListAdmin', () => {
    test('renders correctly', async () => {
        render(<VetListAdmin test={true} />);
        testRenderList(/vets/i, true);
    });

    test('renders vets correctly', async () => {
        render(<VetListAdmin test={true} />);
        const vet1 = await screen.findByRole('cell', { 'name': 'vet1' });
        expect(vet1).toBeInTheDocument();

        const editButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(editButtons).toHaveLength(2);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /delete/ });
        expect(deleteButtons).toHaveLength(2)

        const vet2 = await screen.findByRole('cell', { 'name': 'vet2' });
        expect(vet2).toBeInTheDocument();

        const vets = await screen.findAllByRole('row', {},);
        expect(vets).toHaveLength(3);
    });

    test('delete vet correct', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<VetListAdmin test={true} />);

        const vet1Delete = await screen.findByRole('button', { 'name': 'delete-1' });
        await user.click(vet1Delete);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });
});