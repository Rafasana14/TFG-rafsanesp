import { rest } from "msw";
import { server } from "../../mocks/server";
import { checkOption, checkRadio, fillForm, render, screen, testRenderForm, waitFor } from "../../test-utils";
import OwnerEditAdmin from "./OwnerEditAdmin";
import * as router from 'react-router'

const navigate = jest.fn()

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

describe('OwnerEditAdmin', () => {
    const form = [
        [/first name/i, "textbox", "test name"],
        [/last name/i, "textbox", "test surname"],
        [/address/i, "textbox", "test address"],
        [/city/i, "textbox", "test city"],
        [/telephone/i, "textbox", "111111111"],
        [/plan/i, "combobox", "BASIC"],
        [/user/i, "combobox", "1", "disabled"]
    ];

    const formVet = [
        [/first name/i, "textbox", "test name"],
        [/last name/i, "textbox", "test surname"],
        [/address/i, "textbox", "test address"],
        [/city/i, "textbox", "test city"],
        [/telephone/i, "textbox", "111111111"],
        [/plan/i, "combobox", "BASIC"]
    ];

    const formUser = [
        [/first name/i, "textbox", "test name"],
        [/last name/i, "textbox", "test surname"],
        [/address/i, "textbox", "test address"],
        [/city/i, "textbox", "test city"],
        [/telephone/i, "textbox", "111111111"],
        [/plan/i, "combobox", "BASIC"],
        [/username/i, "textbox", "test username"],
        [/password/i, "label", "test password"]
    ];
    const route = '/owners/new'

    test('renders correctly', async () => {
        const { user } = render(<OwnerEditAdmin />, { route: route })
        await checkRadio(user, /no/i);
        testRenderForm(/add owner/i, form);
    });

    test('renders correctly for vets', async () => {
        render(<OwnerEditAdmin admin={false} />, { route: route })
        testRenderForm(/owner details/i, formVet);
    });

    test('creates owner correctly', async () => {
        const { user } = render(<OwnerEditAdmin />, { route: route })
        await checkRadio(user, /no/i);
        await checkOption(/admin1/i);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/owners'));
    });

    test('creates owner and user correctly', async () => {
        const { user } = render(<OwnerEditAdmin />, { route: route })
        await checkRadio(user, /yes/i);
        await fillForm(user, formUser);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/owners'));
    });

    test('edit owner renders correctly', async () => {
        const { user } = render(<OwnerEditAdmin />, { route: '/owners/1' })
        const heading = await screen.findByRole('heading', { 'name': /edit owner/i });
        expect(heading).toBeInTheDocument();

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        await waitFor(async () => expect(navigate).toHaveBeenCalledWith('/owners'));
    });

    test('creates owner with exception', async () => {
        server.use(
            rest.post('*/owners', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json(
                        {
                            message: 'Error creating owner'
                        }
                    )
                )
            })
        )
        const { user } = render(<OwnerEditAdmin />, { route: route })
        await checkRadio(user, /no/i);
        await checkOption(/admin1/i);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        expect(navigate).not.toHaveBeenCalledWith('/owners');

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();

    });
});