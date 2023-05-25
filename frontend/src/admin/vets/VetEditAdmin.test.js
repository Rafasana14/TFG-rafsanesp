import { rest } from "msw";
import { server } from "../../mocks/server";
import { checkOption, fillForm, render, screen, testFilledEditForm, testRenderForm, waitFor } from "../../test-utils";
import * as router from 'react-router'
import VetEditAdmin from "./VetEditAdmin";

const navigate = jest.fn()

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

describe('VetEditAdmin', () => {
    const form = [
        [/first name/i, "textbox", "test name"],
        [/last name/i, "textbox", "test surname"],
        [/city/i, "textbox", "test city"],
        [/user/i, "combobox", "1", "disabled"]
    ];
    const route = '/vets/new'

    test('renders correctly', async () => {
        render(<VetEditAdmin />, { route: route })
        testRenderForm(/add vet/i, form);
    });

    test('creates vet correctly', async () => {
        const { user } = render(<VetEditAdmin />, { route: route });

        await checkOption(/admin1/i);

        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/vets'));
    });

    test('edit vet renders correctly', async () => {
        const { user } = render(<VetEditAdmin />, { route: '/vets/1' })
        const heading = await screen.findByRole('heading', { 'name': /edit vet/i });
        expect(heading).toBeInTheDocument();
        await checkOption(/owner1/i);

        await testFilledEditForm(form)

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/vets'));
    });

    test('creates vet with exception', async () => {
        server.use(
            rest.post('*/vets', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json(
                        {
                            message: 'Error creating vet'
                        }
                    )
                )
            })
        )
        const { user } = render(<VetEditAdmin />, { route: route });
        await checkOption(/admin1/i);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await waitFor(async () => await user.click(submit));

        expect(navigate).not.toHaveBeenCalledWith('/vets');

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });
});