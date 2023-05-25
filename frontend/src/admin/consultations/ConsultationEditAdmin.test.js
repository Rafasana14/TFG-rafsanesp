import { rest } from "msw";
import { server } from "../../mocks/server";
import { checkOption, fillForm, render, screen, testFilledEditForm, testRenderForm, waitFor } from "../../test-utils";
import * as router from 'react-router'
import ConsultationEditAdmin from "./ConsultationEditAdmin";

const navigate = jest.fn()

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

describe('ConsultationEditAdmin', () => {
    const form = [
        [/title/i, "textbox", "test name"],
        [/status/i, "combobox", "PENDING"],
        [/owner/i, "combobox", "1"],
        [/pet/i, "combobox"]
    ];
    const route = '/consultations/new'

    test('renders correctly', async () => {
        render(<ConsultationEditAdmin />, { route: route })
        testRenderForm(/add consultation/i, form);
    });

    test('creates consultation correctly', async () => {
        const { user } = render(<ConsultationEditAdmin />, { route: route });
        await checkOption(/owner1/i);
        await fillForm(user, form);
        await checkOption(/leo/i);
        await user.selectOptions(screen.getByRole("combobox", { 'name': /pet/i }), "1");

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/consultations'));
    });

    test('edit consultation renders correctly', async () => {
        const { user } = render(<ConsultationEditAdmin />, { route: '/consultations/1' })
        const heading = await screen.findByRole('heading', { 'name': /edit consultation/i });
        expect(heading).toBeInTheDocument();
        await checkOption(/leo/i);

        await testFilledEditForm(form)

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/consultations'));
    });

    test('creates consultation with exception', async () => {
        server.use(
            rest.post('*/consultations', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json(
                        {
                            message: 'Error creating consultation'
                        }
                    )
                )
            })
        )
        const { user } = render(<ConsultationEditAdmin />, { route: route });
        await checkOption(/owner1/i);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        expect(navigate).not.toHaveBeenCalledWith('/consultations');

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });
});