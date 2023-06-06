import { render, screen, testRenderList } from "../../test-utils";
import SpecialtyListAdmin from "./SpecialtyListAdmin";

describe('SpecialtyListAdmin', () => {
    test('renders correctly', async () => {
        render(<SpecialtyListAdmin test={true} />);
        testRenderList(/specialties/i);
    });

    test('renders correctly for vets', async () => {
        render(<SpecialtyListAdmin test={true} admin={false} />);
        testRenderList(/specialties/i, false);

        const detailsButtons = screen.queryAllByRole('link', { 'name': /details/ });
        expect(detailsButtons).toHaveLength(0);
    });

    test('renders specialties correctly', async () => {
        render(<SpecialtyListAdmin test={true} />);
        const specialty1 = await screen.findByRole('cell', { 'name': 'surgery' });
        expect(specialty1).toBeInTheDocument();

        const editButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(editButtons).toHaveLength(3);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /delete/ });
        expect(deleteButtons).toHaveLength(3);

        const specialty2 = await screen.findByRole('cell', { 'name': 'dentistry' });
        expect(specialty2).toBeInTheDocument();

        const specialties = await screen.findAllByRole('row', {},);
        expect(specialties).toHaveLength(4);
    });

    test('delete specialty correct', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<SpecialtyListAdmin test={true} />);

        const specialty1Delete = await screen.findByRole('button', { 'name': 'delete-1' });
        await user.click(specialty1Delete);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });
});