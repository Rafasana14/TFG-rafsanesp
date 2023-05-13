import { rest } from "msw";
import { server } from "../../mocks/server";
import { act, checkOption, fillForm, render, screen, testFilledEditForm, testRenderForm, waitFor } from "../../test-utils";
import * as router from 'react-router'
import ConsultationEditOwner from "./ConsultationEditOwner";
import tokenService from "../../services/token.service";
const navigate = jest.fn()

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    const user = { id: 1 }
    tokenService.setUser(user);
})

describe('ConsultationEditOwner', () => {
    const form = [
        [/title/i, "textbox", "test name"],
        [/pet/i, "combobox", "1"]
    ];
    const route = '/consultations/new'

    test('renders correctly', async () => {
        render(<ConsultationEditOwner />, { route: route })
        testRenderForm(/add consultation/i, form);
    });

    test('creates consultation correctly', async () => {
        const { user } = render(<ConsultationEditOwner />, { route: route });
        await checkOption(/leo/i);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await act(async () => await user.click(submit));

        expect(navigate).toHaveBeenCalledWith('/consultations')
    });

    test('edit consultation renders correctly', async () => {
        const { user } = render(<ConsultationEditOwner />, { route: '/consultations/1' })
        const heading = await screen.findByRole('heading', { 'name': /edit consultation/i });
        expect(heading).toBeInTheDocument();
        await checkOption(/leo/i);

        await testFilledEditForm(form)

        const submit = screen.getByRole('button', { name: /save/i })
        await act(async () => await user.click(submit));

        expect(navigate).toHaveBeenCalledWith('/consultations')
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
        const { user } = render(<ConsultationEditOwner />, { route: route });
        await checkOption(/leo/i);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await waitFor(async () => await user.click(submit));

        expect(navigate).not.toHaveBeenCalledWith('/consultations');

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });
});