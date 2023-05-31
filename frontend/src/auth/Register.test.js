import { fillForm, render, screen, testRenderForm, waitFor } from "../test-utils";
import Register from "./Register";
import { server } from "../mocks/server";
import { rest } from "msw";

describe('Register', () => {
    const form = [
        [/username/i, "textbox", "username"],
        [/password/i, "label", "password"],
        [/first name/i, "textbox", "name"],
        [/last name/i, "textbox", "surname",],
        [/city/i, "textbox", "city",]
    ];

    const ownerFields = [
        [/address/i, "textbox", "address"],
        [/telephone/i, "textbox", "123123123"],
    ];

    const realLocation = window.location;

    beforeAll(() => {
        delete window.location
        window.location = { ...realLocation, assign: jest.fn() }
    })

    afterAll(() => {
        window.location = realLocation
    })

    test('renders vet register correctly', async () => {
        const { user } = render(<Register />)
        const vetButton = screen.getByRole('button', { name: /vet/i })
        await user.click(vetButton);
        testRenderForm(/register vet/i, form);
    });

    test('renders owner register correctly', async () => {
        const { user } = render(<Register />)
        const ownerButton = screen.getByRole('button', { name: /owner/i })
        await user.click(ownerButton);
        testRenderForm(/register owner/i, form);
        testRenderForm(/register owner/i, ownerFields);
    });

    test('back button correctly', async () => {
        const { user } = render(<Register />);

        const vetButton = screen.getByRole('button', { name: /vet/i })
        await user.click(vetButton);

        const backButton = await screen.findByRole('button', { name: /back/i })
        await user.click(backButton);

        const ownerButton = await screen.findByRole('button', { name: /owner/i })
        expect(ownerButton).toBeInTheDocument();
    });

    test('register user correctly', async () => {
        const { user } = render(<Register />);

        const vetButton = screen.getByRole('button', { name: /vet/i })
        await user.click(vetButton);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i });
        await user.click(submit);

        await waitFor(() => expect(window.location.assign).toHaveBeenCalledWith('/dashboard'));
    });

    async function testError(user) {
        const vetButton = screen.getByRole('button', { name: /vet/i })
        await user.click(vetButton);
        await fillForm(user, form);

        const submit = screen.getByRole('button', { name: /save/i });
        await user.click(submit);

        expect(window.location.assign).not.toHaveBeenCalled();
    }

    test('register user fails', async () => {
        const jsdomAlert = window.alert;
        window.alert = () => { return true };
        server.use(
            rest.post('*/auth/signup', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json(
                        'Error registering'
                    )
                )
            })
        )
        const { user } = render(<Register />);

        await testError(user);

        window.confirm = jsdomAlert;
    });

    test('register login fails', async () => {
        const jsdomAlert = window.alert;
        window.alert = () => { return true };
        server.use(
            rest.post('*/auth/signin', (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json(
                        'Error logging in'
                    )
                )
            })
        )
        const { user } = render(<Register />);

        await testError(user)

        window.confirm = jsdomAlert;
    });
});