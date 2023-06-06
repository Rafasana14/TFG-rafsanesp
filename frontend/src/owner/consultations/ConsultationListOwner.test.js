import { render, screen, testRenderList } from "../../test-utils";
import { rest } from "msw";
import { server } from "../../mocks/server";
import ConsultationListOwner from "./ConsultationListOwner";

describe('ConsultationListOwner', () => {
    test('renders correctly', async () => {
        render(<ConsultationListOwner test={true} />);
        testRenderList(/consultations/i);
    });

    test('renders correctly for not PLATINUM', async () => {
        server.use(
            rest.get('*/plan', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json(
                        {
                            plan: 'GOLD'
                        }
                    )
                )
            })
        )
        render(<ConsultationListOwner test={true} />);
        testRenderList(/consultations/i);

        const editButtons = screen.queryAllByRole('link', { 'name': /edit/ });
        expect(editButtons).toHaveLength(0);

        const addButtons = screen.queryByRole('link', { 'name': /add/ });
        expect(addButtons).not.toBeInTheDocument();
    });

    test('renders consultations correctly', async () => {
        render(<ConsultationListOwner test={true} />);
        const consultation1 = await screen.findByRole('cell', { 'name': 'Mi gato no come' });
        expect(consultation1).toBeInTheDocument();

        const consultation1Status = await screen.findByRole('cell', { 'name': 'ANSWERED' });
        expect(consultation1Status).toBeInTheDocument();

        const consultation2Status = await screen.findByRole('cell', { 'name': 'PENDING' });
        expect(consultation2Status).toBeInTheDocument();

        const editButtons = await screen.findAllByRole('link', { 'name': /edit/ });
        expect(editButtons).toHaveLength(2);

        const consultations = await screen.findAllByRole('row', {},);
        expect(consultations).toHaveLength(3);
    });
});