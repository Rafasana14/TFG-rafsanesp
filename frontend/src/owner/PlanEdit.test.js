import { rest } from "msw";
import { server } from "../mocks/server";
import { act, render, screen } from "../test-utils";
import PlanEdit from "./PlanEdit";


describe('PlanEditOwner', () => {
    test('renders correctly', async () => {
        render(<PlanEdit />)

        const currentPlan = await screen.findByRole('heading', { name: /platinum/i });
        expect(currentPlan).toBeInTheDocument();

        const table = screen.getByRole('table', { name: /pricing/i });
        expect(table).toBeInTheDocument();

        const platinum = screen.queryByRole('button', { name: /change-platinum/i });
        expect(platinum).not.toBeInTheDocument(2);

        const change = await screen.findAllByRole('button', { name: /change/i });
        expect(change).toHaveLength(2);
    });

    test('changes plan to gold correctly', async () => {
        const { user } = render(<PlanEdit />)

        let currentPlan = await screen.findByRole('heading', { name: /platinum/i });
        expect(currentPlan).toBeInTheDocument();

        const gold = screen.getByRole('button', { name: /change-gold/i });
        await act(async () => await user.click(gold));

        currentPlan = await screen.findByRole('heading', { name: /gold/i });
        expect(currentPlan).toBeInTheDocument();

        const change = screen.queryByRole('button', { name: /change-gold/i });
        expect(change).not.toBeInTheDocument();
    });

    test('changes to basic plan correctly', async () => {
        server.use(
            rest.put('*/api/v1/plan', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            plan: "BASIC"
                        }
                    )
                )
            })
        )
        const { user } = render(<PlanEdit />)

        let currentPlan = await screen.findByRole('heading', { name: /platinum/i });
        expect(currentPlan).toBeInTheDocument();

        const basic = screen.getByRole('button', { name: /change-basic/i });
        await act(async () => await user.click(basic));

        currentPlan = await screen.findByRole('heading', { name: /basic/i });
        expect(currentPlan).toBeInTheDocument();

        const change = screen.queryByRole('button', { name: /change-basic/i });
        expect(change).not.toBeInTheDocument();
    });

    test('changes to platinum plan correctly', async () => {
        server.use(
            rest.put('*/api/v1/plan', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            plan: "PLATINUM"
                        }
                    )
                )
            }),
            rest.get('*/api/v1/plan', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json(
                        {
                            plan: "BASIC"
                        }
                    )
                )
            })
        )
        const { user } = render(<PlanEdit />)

        let currentPlan = await screen.findByRole('heading', { name: /basic/i });
        expect(currentPlan).toBeInTheDocument();

        const platinum = screen.getByRole('button', { name: /change-platinum/i });
        await act(async () => await user.click(platinum));

        currentPlan = await screen.findByRole('heading', { name: /platinum/i });
        expect(currentPlan).toBeInTheDocument();

        const change = screen.queryByRole('button', { name: /change-platinum/i });
        expect(change).not.toBeInTheDocument();
    });

    test('changes plan with exception', async () => {
        server.use(
            rest.put('*/api/v1/plan', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json(
                        {
                            message: 'Error changing plan'
                        }
                    )
                )
            })
        )
        const { user } = render(<PlanEdit />);
        const currentPlan = await screen.findByRole('heading', { name: /platinum/i });
        expect(currentPlan).toBeInTheDocument();

        const gold = screen.getByRole('button', { name: /change-gold/i });
        await user.click(gold);

        const planChanged = screen.queryByRole('heading', { name: /gold/i });
        expect(planChanged).not.toBeInTheDocument();

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });
});