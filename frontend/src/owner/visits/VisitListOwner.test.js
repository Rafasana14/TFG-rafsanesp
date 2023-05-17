import { rest } from "msw";
import { server } from "../../mocks/server";
import { render, screen, testRenderList } from "../../test-utils";
import VisitListOwner from "./VisitListOwner";

describe('VisitListOwner', () => {
    test('renders correctly', async () => {
        render(<VisitListOwner test={true} />);
        testRenderList(/visits/i, true);
    });

    test('renders visits correctly', async () => {
        render(<VisitListOwner test={true} />);
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
        render(<VisitListOwner test={true} />);

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
        render(<VisitListOwner test={true} />);

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });

    test('cancel visit correct', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<VisitListOwner test={true} />);

        const visit1Cancel = await screen.findByRole('button', { 'name': 'cancel-1' });
        await user.click(visit1Cancel);
        const alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });
});