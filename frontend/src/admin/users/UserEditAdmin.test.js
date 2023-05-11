import { rest } from "msw";
import { server } from "../../mocks/server";
import { checkOption, fillForm, render, screen, testFilledEditForm, testRenderForm, waitFor } from "../../test-utils";
import * as router from 'react-router'
import UserEditAdmin from "./UserEditAdmin";

const navigate = jest.fn()

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

describe('UserEditAdmin', () => {
    const form = [
        [/username/i, "textbox", "test name"],
        [/authority/i, "combobox", "1", "disabled"]
    ];
    const route = '/users/new'

    test('renders correctly', async () => {
        render(<UserEditAdmin />, { route: route })
        testRenderForm(/add user/i, form);
    });

    test('creates user correctly', async () => {
        const { user } = render(<UserEditAdmin />, { route: route });
        await checkOption(/admin/i);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await waitFor(async () => await user.click(submit));

        expect(navigate).toHaveBeenCalledWith('/users')
    });

    test('edit user renders correctly', async () => {
        const { user } = render(<UserEditAdmin />, { route: '/users/1' })
        const heading = await screen.findByRole('heading', { 'name': /edit user/i });
        expect(heading).toBeInTheDocument();
        await checkOption(/admin/i);

        await testFilledEditForm(form);

        const submit = screen.getByRole('button', { name: /save/i })
        await waitFor(async () => await user.click(submit));

        expect(navigate).toHaveBeenCalledWith('/users')
    });

    test('creates user with exception', async () => {
        server.use(
            rest.post('*/users', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json(
                        {
                            message: 'Error creating user'
                        }
                    )
                )
            })
        )
        const { user } = render(<UserEditAdmin />, { route: route })
        await checkOption(/admin/i);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await waitFor(async () => await user.click(submit));

        expect(navigate).not.toHaveBeenCalledWith('/users');

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();

    });
});