import { rest } from "msw";
import { server } from "../../mocks/server";
import { act, fillForm, render, screen, testFilledEditForm, testRenderForm } from "../../test-utils";
import * as router from 'react-router'
import SpecialtyEditAdmin from "./SpecialtyEditAdmin";

const navigate = jest.fn()

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

describe('SpecialtyEditAdmin', () => {
    const form = [
        [/name/i, "textbox", "test name"],
    ];
    const route = '/vets/specialties/new'

    test('renders correctly', async () => {
        render(<SpecialtyEditAdmin />, { route: route })
        testRenderForm(/add specialty/i, form);
    });

    test('creates specialty correctly', async () => {
        const { user } = render(<SpecialtyEditAdmin />, { route: route })
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await act(async () => await user.click(submit));

        expect(navigate).toHaveBeenCalledWith('/vets/specialties')
    });

    test('edit specialty renders correctly', async () => {
        const { user } = render(<SpecialtyEditAdmin />, { route: '/vets/specialties/1' })
        const heading = await screen.findByRole('heading', { 'name': /edit specialty/i });
        expect(heading).toBeInTheDocument();

        await testFilledEditForm(form)

        const submit = screen.getByRole('button', { name: /save/i })
        await act(async () => await user.click(submit));

        expect(navigate).toHaveBeenCalledWith('/vets/specialties')
    });

    test('creates specialty with exception', async () => {
        server.use(
            rest.post('*/vets/specialties', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json(
                        {
                            message: 'Error creating specialty'
                        }
                    )
                )
            })
        )
        const { user } = render(<SpecialtyEditAdmin />, { route: route })
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await act(async () => await user.click(submit));

        expect(navigate).not.toHaveBeenCalledWith('/vets/specialties');

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();

    });
});