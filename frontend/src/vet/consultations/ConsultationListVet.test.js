import { rest } from "msw";
import { server } from "../../mocks/server";
import { render, screen } from "../../test-utils";
import ConsultationListVet from "./ConsultationListVet";

describe('ConsultationListVet', () => {
    test('renders correctly', async () => {
        render(<ConsultationListVet test={true} />);
        const heading = screen.getByRole('heading', { 'name': /consultations/i });
        expect(heading).toBeInTheDocument();

        const grid = screen.getByRole('grid', { 'name': /consultations/i });
        expect(grid).toBeInTheDocument();
    });

    test('renders consultations correctly', async () => {
        render(<ConsultationListVet test={true} />);
        const consultation1 = await screen.findByRole('cell', { 'name': /Mi gato no come/i });
        expect(consultation1).toBeInTheDocument();

        const consultation2 = await screen.findByRole('cell', { 'name': /Título 2/ });
        expect(consultation2).toBeInTheDocument();

        const detailsButtons = await screen.findAllByRole('link', { 'name': /details/ });
        expect(detailsButtons).toHaveLength(2);

        const visits = await screen.findAllByRole('row', {},);
        expect(visits).toHaveLength(3);
    });

    test('renders consultations with exception', async () => {
        server.use(
            rest.get('*/consultations', (req, res, ctx) => {
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
        render(<ConsultationListVet test={true} />);

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });
});