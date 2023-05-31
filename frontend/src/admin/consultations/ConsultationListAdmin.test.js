import { render, screen, testRenderList } from "../../test-utils";
import ConsultationListAdmin from "./ConsultationListAdmin";

describe('ConsultationListAdmin', () => {
    test('renders correctly', async () => {
        render(<ConsultationListAdmin test={true} />);
        testRenderList(/consultations/i, true);
    });

    test('renders consultations correctly', async () => {
        render(<ConsultationListAdmin test={true} />);
        const consultation1 = await screen.findByRole('cell', { 'name': /Mi gato no come/i });
        expect(consultation1).toBeInTheDocument();

        const consultation2 = await screen.findByRole('cell', { 'name': /Título 2/ });
        expect(consultation2).toBeInTheDocument();

        const detailsButtons = await screen.findAllByRole('link', { 'name': /details/ });
        expect(detailsButtons).toHaveLength(2);

        const editButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(editButtons).toHaveLength(2);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /delete/ });
        expect(deleteButtons).toHaveLength(2)

        const consultations = await screen.findAllByRole('row', {},);
        expect(consultations).toHaveLength(3);
    });

    test('delete consultation correct', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<ConsultationListAdmin test={true} />);

        const consultation1Delete = await screen.findByRole('button', { 'name': 'delete-1' });
        await user.click(consultation1Delete);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });
});