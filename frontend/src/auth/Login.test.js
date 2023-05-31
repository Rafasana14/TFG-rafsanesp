import { fillForm, render, screen, testRenderForm, waitFor } from "../test-utils";
import { server } from "../mocks/server";
import { rest } from "msw";
import Login from "./Login";

describe('Login', () => {
    const form = [
        [/username/i, "textbox", "username"],
        [/password/i, "label", "password"],
    ];

    const realLocation = window.location;

    beforeAll(() => {
        delete window.location
        window.location = { ...realLocation, assign: jest.fn(), reload: jest.fn() }
    })

    afterAll(() => {
        window.location = realLocation
    })

    test('renders correctly', async () => {
        render(<Login />)
        testRenderForm(/sign in/i, form);
    });

    test('register user correctly', async () => {
        const { user } = render(<Login />);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /login/i });
        await user.click(submit);

        await waitFor(() => expect(window.location.assign).toHaveBeenCalledWith('/dashboard'));
    });

    test('register user correctly with navigation', async () => {
        const { user } = render(<Login navigation={true} />);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /login/i });
        await user.click(submit);

        await waitFor(() => expect(window.location.reload).toHaveBeenCalled());
    });

    test('login fails', async () => {
        const jsdomAlert = window.alert;
        window.alert = () => { return true };
        server.use(
            rest.post('*/auth/signin', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json(
                        'Error'
                    )
                )
            })
        )
        const { user } = render(<Login />);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /login/i });
        await user.click(submit);

        expect(window.location.assign).not.toHaveBeenCalled();
        window.confirm = jsdomAlert;
    });
});