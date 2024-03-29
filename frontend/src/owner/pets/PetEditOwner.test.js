import { rest } from "msw";
import { server } from "../../mocks/server";
import { checkOption, fillForm, render, screen, testRenderForm, waitFor } from "../../test-utils";
import * as router from 'react-router';
import PetEditOwner from "./PetEditOwner";

const navigate = jest.fn()

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

describe('PetEditOwner', () => {
    const form = [
        [/name/i, "textbox", "test name"],
        [/birth date/i, "label", "2023-05-11"],
        [/type/i, "combobox", "1"],
    ];
    const route = '/pets/new'

    test('renders correctly', async () => {
        render(<PetEditOwner />, { route: route })
        testRenderForm(/add pet/i, form);
    });

    test('creates pet correctly', async () => {
        const { user } = render(<PetEditOwner />, { route: route });

        await checkOption(/cat/i);

        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/pets'));
    });

    test('edit pet renders correctly', async () => {
        const { user } = render(<PetEditOwner />, { route: '/pets/1' })
        const heading = await screen.findByRole('heading', { 'name': /edit pet/i });
        expect(heading).toBeInTheDocument();
        await checkOption(/dog/i);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/pets'));
    });

    test('creates pet with exception', async () => {
        server.use(
            rest.post('*/pets', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json(
                        {
                            message: 'Error creating pet'
                        }
                    )
                )
            })
        )
        const { user } = render(<PetEditOwner />, { route: route });
        await checkOption(/dog/i);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        expect(navigate).not.toHaveBeenCalledWith('/pets');

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });
});