import { fillForm, render, screen } from "../test-utils";
import { server } from "../mocks/server";
import { rest } from "msw";
import tokenService from "../services/token.service";
import * as router from 'react-router'
import ProfileEdit from "./ProfileEdit";
const navigate = jest.fn()

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    const user = { id: 1 }
    tokenService.setUser(user);
})

describe('ProfileEdit', () => {
    const adminForm = [
        [/username/i, "textbox", "test name"],
        [/password/i, "label", "password"],
    ];

    const vetForm = [...adminForm,
    [/first name/i, "textbox", "test name"],
    [/last name/i, "textbox", "test surname"],
    [/city/i, "textbox", "test city"],
    ];

    const ownerForm = [...vetForm,
    [/telephone/i, "textbox", "111111111"],
    [/address/i, "textbox", "test address"]]
    const route = '/profile'

    const realLocation = window.location;

    beforeAll(() => {
        delete window.location
        window.location = { ...realLocation, reload: jest.fn() }
    })

    afterAll(() => {
        window.location = realLocation
    })

    test('renders correctly for admin', async () => {
        render(<ProfileEdit auth={"ADMIN"} />, { route: route });
        const heading = screen.getByRole('heading', { 'name': /my profile/i });
        expect(heading).toBeInTheDocument();
    });

    test('edits profile correctly for admin', async () => {
        const { user } = render(<ProfileEdit auth={"ADMIN"} />, { route: route });

        await fillForm(user, adminForm);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        const alert = await screen.findByRole('alert', { name: /alert-edit/i })
        expect(alert).toBeInTheDocument();

        expect(window.location.reload).toHaveBeenCalled();
    });

    test('edits profile dismiss alert admin', async () => {
        const { user } = render(<ProfileEdit auth={"ADMIN"} />, { route: route });

        await fillForm(user, adminForm);

        const submit = screen.getByRole('button', { name: /save/i });
        await user.click(submit);

        let alert = await screen.findByRole('alert', { name: /alert-edit/i });
        expect(alert).toBeInTheDocument();

        const dismiss = await screen.findByRole('button', { name: /close/i });
        await user.click(dismiss);

        alert = screen.queryByRole('alert', { name: /alert-edit/i });
        expect(alert).not.toBeInTheDocument();
    });

    test('renders correctly for owner', async () => {
        render(<ProfileEdit auth={"OWNER"} />, { route: route });
        const heading = screen.getByRole('heading', { 'name': /my profile/i });
        expect(heading).toBeInTheDocument();
    });

    test('edits profile correctly for owner', async () => {
        const { user } = render(<ProfileEdit auth={"OWNER"} />, { route: route });

        await fillForm(user, ownerForm);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        const alert = await screen.findByRole('alert', { name: /alert-edit/i })
        expect(alert).toBeInTheDocument();

        expect(window.location.reload).toHaveBeenCalled();
    });

    test('renders correctly for vet', async () => {
        render(<ProfileEdit auth={"VET"} />, { route: route });
        const heading = screen.getByRole('heading', { 'name': /my profile/i });
        expect(heading).toBeInTheDocument();
    });

    test('edits profile with error for vet', async () => {
        server.use(
            rest.put('*/vets/profile', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json({
                        message: 'Error'
                    })
                )
            })
        )
        const { user } = render(<ProfileEdit auth={"VET"} />, { route: route });

        await fillForm(user, vetForm);

        const submit = screen.getByRole('button', { name: /save/i })
        await user.click(submit);

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });

    test('back button correctly for vet', async () => {
        const { user } = render(<ProfileEdit auth={"VET"} />, { route: route });
        const back = screen.getByRole('button', { 'name': /back/i });
        await user.click(back);

        expect(navigate).toHaveBeenCalledWith(-1);
    });

    test('fetch profile with error', async () => {
        server.use(
            rest.get('*/vets/profile', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json({
                        message: 'Error'
                    })
                )
            })
        )
        render(<ProfileEdit auth={"VET"} />, { route: route });

        const modal = await screen.findByRole('dialog');
        expect(modal).toBeInTheDocument();
    });
});