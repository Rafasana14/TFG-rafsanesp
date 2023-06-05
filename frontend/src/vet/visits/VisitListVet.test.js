import { rest } from "msw";
import { server } from "../../mocks/server";
import { render, screen, testRenderList } from "../../test-utils";
import VisitListVet from "./VisitListVet";
import tokenService from "../../services/token.service";

describe('VisitListVet', () => {
    test('renders correctly', async () => {
        render(<VisitListVet test={true} />);
        testRenderList(/visits/i, true, false);
    });

    test('renders visits correctly', async () => {
        render(<VisitListVet test={true} />);
        const visit1 = await screen.findByRole('cell', { 'name': /description1/i });
        expect(visit1).toBeInTheDocument();

        const visit2 = await screen.findByRole('cell', { 'name': 'No description provided' });
        expect(visit2).toBeInTheDocument();

        const editButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(editButtons).toHaveLength(2);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /cancel/ });
        expect(deleteButtons).toHaveLength(1);

        const visits = await screen.findAllByRole('row', {},);
        expect(visits).toHaveLength(3);
    });

    test('renders visits with exception', async () => {
        server.use(
            rest.get('*/visits', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            message: 'Error fetching data'
                        }
                    )
                )
            })
        )
        render(<VisitListVet test={true} />);

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });

    test('renders visits with server error', async () => {
        server.use(
            rest.get('*/visits', (req, res, ctx) => {
                return res(
                    ctx.status(500),

                )
            })
        )
        render(<VisitListVet test={true} />);

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });

    test('delete visit correct', async () => {
        tokenService.setUser({ id: 12 })
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<VisitListVet test={true} />);

        const visit1Delete = await screen.findByRole('button', { 'name': 'cancel-1' });
        await user.click(visit1Delete);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });
});