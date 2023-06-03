import { rest } from "msw";
import { server } from "../../mocks/server";
import { render, screen, testRenderList } from "../../test-utils";
import OwnerListAdmin from "./OwnerListAdmin";

describe('OwnerListAdmin', () => {
    test('renders correctly', async () => {
        render(<OwnerListAdmin test={true} />);
        testRenderList(/owners/i, true);
    });

    test('renders owners correctly', async () => {
        render(<OwnerListAdmin test={true} />);
        const owner1 = await screen.findByRole('cell', { 'name': /george/i });
        expect(owner1).toBeInTheDocument();

        const editButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(editButtons).toHaveLength(2);

        const deleteButtons = await screen.findAllByRole('button', { 'name': /delete/ });
        expect(deleteButtons).toHaveLength(2);

        const owner2 = await screen.findByRole('cell', { 'name': 'owner2' });
        expect(owner2).toBeInTheDocument();

        const owners = await screen.findAllByRole('row', {},);
        expect(owners).toHaveLength(3);
    });

    test('renders owners with exception', async () => {
        server.use(
            rest.get('*/owners', (req, res, ctx) => {
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
        render(<OwnerListAdmin test={true} />);

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });

    // test('renders owners with server error', async () => {
    //     server.use(
    //         rest.get('*/owners', (req, res, ctx) => {
    //             return res(
    //                 ctx.status(500),

    //             )
    //         })
    //     )
    //     render(<OwnerListAdmin test={true} />);

    //     const modal = await screen.findByRole('dialog');
    //     expect(modal).toBeInTheDocument();
    // });

    test('delete owner correct', async () => {
        const jsdomConfirm = window.confirm;
        window.confirm = () => { return true };
        const { user } = render(<OwnerListAdmin test={true} />);

        const owner1Delete = await screen.findByRole('button', { 'name': 'delete-owner1' });
        await user.click(owner1Delete);
        let alert = await screen.findByRole('alert');
        expect(alert).toBeInTheDocument();

        const dismiss = await screen.findByRole('button', { name: /close/i });
        await user.click(dismiss);

        alert = screen.queryByRole('alert');
        expect(alert).not.toBeInTheDocument();

        window.confirm = jsdomConfirm;
    });
});