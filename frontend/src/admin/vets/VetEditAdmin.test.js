import { rest } from "msw";
import { server } from "../../mocks/server";
import { checkOption, checkRadio, fillForm, render, screen, testRenderForm, waitFor } from "../../test-utils";
import * as router from 'react-router'
import VetEditAdmin from "./VetEditAdmin";

const navigate = jest.fn()

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

describe('VetEditAdmin', () => {
    const form1 = [
        [/first name/i, "textbox", "test name"],
        [/last name/i, "textbox", "test surname"],
        [/city/i, "textbox", "test city"],
        [/user/i, "combobox", "1", "disabled"]
    ];
    const form2 = [
        [/first name/i, "textbox", "test name"],
        [/last name/i, "textbox", "test surname"],
        [/city/i, "textbox", "test city"],
        [/username/i, "textbox", "test username"],
        [/password/i, "label", "test password"]
    ];
    const route = '/vets/new'

    test('renders correctly', async () => {
        const { user } = render(<VetEditAdmin />, { route: route });
        await checkRadio(user, /no/i);
        await checkOption(/admin1/i);
        testRenderForm(/add vet/i, form1);
    });

    test('creates vet correctly', async () => {
        const { user } = render(<VetEditAdmin />, { route: route });

        await checkRadio(user, /no/i);
        await checkOption(/admin1/i);

        await fillForm(user, form1);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/vets'));
    });

    test('creates vet and user correctly', async () => {
        const { user } = render(<VetEditAdmin />, { route: route });

        await checkRadio(user, /yes/i);
        await fillForm(user, form2);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/vets'));
    });

    test('creates vet and user with error in user', async () => {
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
        const { user } = render(<VetEditAdmin />, { route: route });

        await checkRadio(user, /yes/i);
        await fillForm(user, form2);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        expect(navigate).not.toHaveBeenCalledWith('/vets');

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });

    test('creates vet and user with error in vet', async () => {
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

        await checkRadio(user, /yes/i);
        await fillForm(user, form2);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        expect(navigate).not.toHaveBeenCalledWith('/vets');

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
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
        await checkRadio(user, /no/i);
        await checkOption(/admin1/i);
        await fillForm(user, form1);

        const submit = screen.getByRole('button', { name: /save/i })
        await waitFor(async () => await user.click(submit));

        expect(navigate).not.toHaveBeenCalledWith('/vets');

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });

    test('back button works correctly', async () => {
        const { user } = render(<VetEditAdmin />, { route: route });
        const back = screen.getByRole('button', { 'name': /back/i });
        await user.click(back);

        expect(navigate).toHaveBeenCalledWith(-1);
    });

    test('edit vet renders correctly', async () => {
        const { user } = render(<VetEditAdmin />, { route: '/vets/1' })
        const heading = await screen.findByRole('heading', { 'name': /edit vet/i });
        expect(heading).toBeInTheDocument();

        const dentistry = await screen.findByLabelText(/dentistry/i);
        await user.click(dentistry);
        const radiology = await screen.findByLabelText(/radiology/i);
        expect(radiology).toBeChecked();
        await user.click(radiology);
        expect(radiology).not.toBeChecked();

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/vets'));
    });
});