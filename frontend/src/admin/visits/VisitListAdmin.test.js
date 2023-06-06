import tokenService from "../../services/token.service";
import { render, screen, testRenderList } from "../../test-utils";
import VisitListAdmin from "./VisitListAdmin";

describe('VisitListAdmin', () => {
    test('renders correctly', async () => {
        render(<VisitListAdmin test={true} />);
        testRenderList(/visits/i);
    });

    test('renders correctly for vets', async () => {
        tokenService.setUser({ id: 1 })
        render(<VisitListAdmin test={true} admin={false} />);
        testRenderList(/visits/i, false);

        const detailsButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(detailsButtons).toHaveLength(2);
    });

    test('renders correctly for vets owned visits', async () => {
        tokenService.setUser({ id: 12 })
        render(<VisitListAdmin test={true} admin={false} />);
        testRenderList(/visits/i, false);

        const detailsButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(detailsButtons).toHaveLength(2);
    });

    test('renders visits correctly', async () => {
        render(<VisitListAdmin test={true} />);
        const visit1 = await screen.findByRole('cell', { 'name': 'description1' });
        expect(visit1).toBeInTheDocument();

        const visit2 = await screen.findByRole('cell', { 'name': 'No description provided' });
        expect(visit2).toBeInTheDocument();

        const editButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(editButtons).toHaveLength(2);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /delete/ });
        expect(deleteButtons).toHaveLength(2)

        const visits = await screen.findAllByRole('row', {},);
        expect(visits).toHaveLength(3);
    });

    test('delete visit correct', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<VisitListAdmin test={true} />);

        const visit1Delete = await screen.findByRole('button', { 'name': 'delete-1' });
        await user.click(visit1Delete);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });
});